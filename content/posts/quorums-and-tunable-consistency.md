+++
title = "Quorums and Tunable Consistency"
date = 2026-06-05T09:00:00-07:00
description = "How the R + W > N rule lets you dial the trade-off between consistency, latency, and availability — and where the rule quietly breaks."
tags = ["consistency", "replication", "quorums"]
categories = ["concepts"]
draft = false
+++

Many distributed databases — Dynamo-style stores like Cassandra and Riak — don't
make you choose consistency once and for all. They let you tune it **per request**
using quorums. The mechanism is simple arithmetic with surprisingly deep
consequences.

## The setup

Each piece of data is replicated to **N** nodes. For every operation you pick:

- **W** — how many replicas must acknowledge a *write* before it's considered done.
- **R** — how many replicas you read from and compare before returning.

The headline rule:

```text
If  R + W > N  then every read overlaps at least one node
that saw the latest write — so you can read your writes.
```

With `N = 3`, common choices are:

| Profile            | N | W | R | Property                                   |
|--------------------|---|---|---|--------------------------------------------|
| Strong-ish read    | 3 | 2 | 2 | `R + W = 4 > 3` → overlap guaranteed       |
| Fast writes        | 3 | 1 | 3 | Cheap writes, expensive/consistent reads   |
| Fast reads         | 3 | 3 | 1 | Cheap reads, writes need all replicas      |
| Maximum availability | 3 | 1 | 1 | No overlap; may read stale data            |

## Why this is powerful

You get a single knob that trades **latency and availability** against
**freshness**. Need a low-latency counter that can tolerate staleness? Use
`W=1, R=1`. Need read-your-writes for a user profile? Use `W=2, R=2`. Same cluster,
different guarantees, decided at call time.

```python
# Pseudocode for a quorum read with read-repair.
def quorum_read(key, replicas, R):
    responses = gather(replica.get(key) for replica in pick(replicas, R))
    newest = max(responses, key=lambda r: r.version)
    # Read-repair: quietly push the newest value back to stale replicas.
    for r in responses:
        if r.version < newest.version:
            schedule_repair(r.node, key, newest)
    return newest.value
```

## Where the clean story breaks

The `R + W > N` rule guarantees **overlap**, not **linearizability**. Some sharp
edges:

- **Concurrent writes** can both satisfy `W` and conflict. You need version vectors
  or last-write-wins (and LWW silently drops data).
- **Sloppy quorums** with hinted handoff let writes succeed on *non-home* nodes
  during a partition. That preserves availability but can violate the overlap you
  thought you'd paid for.
- **Failed writes still leave traces.** A write that doesn't reach `W` replicas may
  have reached *some* — so a later read can return a value that "didn't happen."

> Quorums give you a dial, not a guarantee of linearizability. If you need true
> linearizable reads, reach for a consensus protocol (Raft/Paxos) instead.

## Practical defaults

For most user-facing data on `N=3`, `W=2 / R=2` (often called `QUORUM`) is a sane
default: it survives one node failure, gives read-your-writes in the common case,
and keeps latency reasonable. Reserve `ALL` and single-replica modes for the
specific cases that genuinely need them.

The lesson that generalizes: **consistency is a spectrum you can price per
operation.** Knowing the price is most of the battle.
