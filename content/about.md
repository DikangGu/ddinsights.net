+++
title = "About"
description = "About Dikang Gu and Distributed Data Insights — a blog on distributed data systems."
+++

## About me

I'm **Dikang Gu**, a distributed systems engineer who has spent his career building
the data infrastructure behind some of the largest consumer platforms in the world.

I'm currently a **Technical Director at Roblox**, where I lead the OLTP database and
storage platform that provides data storage and serving for Roblox's hundreds of
millions of monthly users and millions of creators. The work centers on
fault-tolerant distributed storage, smart partitioning, rock-solid replication, and
squeezing every drop of performance out of planet-scale systems.

Before Roblox, I spent many years at **Meta (Facebook / Instagram)** on the
infrastructure teams. As tech lead of Instagram's storage team, I helped scale
**Apache Cassandra** to thousands of nodes and led the development of
**Rocksandra** — a pluggable **RocksDB** storage engine for Cassandra — which we
later open-sourced. I've also worked on optimal data placement at global scale
(Akkio) and presented this work at venues including Cassandra Summit, OSCON, F8,
and DataStax Accelerate.

Earlier in my career I worked on virtualization at **VMware**, storage at **EMC**,
and did an internship at **Google**. I hold an M.S. in Computer Science from
**Shanghai Jiao Tong University** and a B.S. in Computer Science from **Nanjing
University of Aeronautics and Astronautics**. I'm based in the San Francisco Bay
Area.

## About this blog

**Distributed Data Insights** is where I write down the patterns, failure modes,
and trade-offs that only really become clear once you've operated these systems in
production:

- **Storage & indexing** — LSM-trees, B-trees, write/read amplification, compaction.
- **Replication & consistency** — quorums, leader election, linearizability vs. eventual consistency.
- **Streaming & pipelines** — exactly-once semantics, backpressure, watermarks.
- **Partitioning & scale** — sharding strategies, hot keys, rebalancing.
- **Operations** — observability, capacity planning, and post-incident lessons.

The goal is practical depth: enough theory to reason from first principles, and
enough real-world detail to actually be useful on Monday morning.

## Get in touch

Find me on [LinkedIn](https://www.linkedin.com/in/dikanggu) or
[GitHub](https://github.com/DikangGu). Want to suggest a topic or point out
something I got wrong? Open an issue or PR on the
[site repository](https://github.com/DikangGu/ddinsights.net).
