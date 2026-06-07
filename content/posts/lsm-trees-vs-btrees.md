+++
title = "LSM-Trees vs. B-Trees: Choosing Your Write Path"
date = 2026-06-02T08:30:00-07:00
description = "Why modern distributed stores reach for LSM-trees, how compaction trades read cost for write throughput, and when a B-tree is still the right call."
tags = ["storage", "lsm-tree", "indexing", "fundamentals"]
categories = ["storage"]
draft = false
+++

Underneath nearly every database is one of two storage engines: a **B-tree** or an
**LSM-tree**. The choice shapes write throughput, read latency, space usage, and
how the system behaves under pressure. It's worth understanding *why* the big
distributed stores — Cassandra, RocksDB, HBase, ScyllaDB — overwhelmingly chose
LSM-trees.

## B-trees: update in place

A B-tree keeps data sorted in fixed-size pages and **mutates pages in place**. To
update a key, you find its page and overwrite it. Reads are excellent — typically
a handful of page lookups — and the structure has powered relational databases for
decades.

The cost shows up on writes:

- Every update is a **random write** to the page holding that key.
- To stay crash-safe, most B-trees also write to a **write-ahead log** first — so
  the data is effectively written twice.
- Under heavy random writes, you pay for seeks (or, on SSDs, write amplification
  and wear).

## LSM-trees: never modify, only append

A Log-Structured Merge-tree flips the strategy. Writes go to an in-memory sorted
structure (the **memtable**); when it fills, it's flushed to disk as an immutable,
sorted file (an **SSTable**). You never update a file — you just write new ones.

```text
write(key, val)
   │
   ▼
 memtable (in RAM, sorted)  ──flush──▶  SSTable L0  ──┐
                                        SSTable L0    ├─ compaction ─▶ L1 ─▶ L2 ...
                                        SSTable L0  ──┘
```

This makes writes **sequential and fast**. The catch: a single key can now live in
many SSTables, so a read may have to check several files. Two things keep reads
fast:

1. **Bloom filters** per SSTable cheaply answer "this key is *definitely not*
   here," skipping most files.
2. **Compaction** merges overlapping SSTables in the background, discarding
   superseded values and tombstones.

```python
def lsm_get(key, memtable, sstables, blooms):
    if key in memtable:
        return memtable[key]
    # Newest SSTables first; stop at the first hit.
    for sst in reversed(sstables):
        if not blooms[sst].might_contain(key):
            continue          # Bloom filter says "not here" — skip the file
        val = sst.lookup(key)
        if val is not None:
            return val
    return None
```

## The amplification trade-off

Every storage engine pays one of three taxes; you can't avoid all three:

- **Write amplification** — bytes written to disk per byte of user data.
- **Read amplification** — extra reads to find one value.
- **Space amplification** — disk used per byte of live data.

| Engine    | Writes        | Reads          | Space        | Sweet spot                         |
|-----------|---------------|----------------|--------------|------------------------------------|
| B-tree    | Random, 2x WAL| Very good      | Compact      | Read-heavy, transactional workloads|
| LSM-tree  | Sequential, fast | Good w/ Blooms | Can bloat pre-compaction | Write-heavy, high-ingest workloads |

Compaction is the knob in the middle: **leveled** compaction keeps read and space
amplification low at the cost of more write amplification; **size-tiered** does the
opposite. Tuning it is most of the operational art of running an LSM store.

## So which should you pick?

- **Write-heavy or high-ingest** (time series, event logs, metrics, telemetry):
  LSM-tree. Sequential writes and cheap ingestion win.
- **Read-heavy with point lookups and transactions** (classic OLTP): a B-tree is
  often simpler and gives predictable low-latency reads.
- **Unsure?** Most general-purpose distributed stores default to LSM because
  ingest scalability tends to be the first wall teams hit.

> There is no free lunch — only a choice of which amplification you'd rather pay.
> Name the dominant access pattern first, then the engine almost picks itself.

In a later post we'll dig into compaction strategies in detail, and why a
misconfigured compactor is one of the most common causes of mysterious latency
spikes in production.
