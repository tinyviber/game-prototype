## Premise

A spider must repair a small rain web between a source flower, two anchors, and a wilted flower. Rain reaches the wilted flower only through the silk edges the spider physically ties.

## Player Decision

Choose which two anchor connections to make with the spider's limited silk. One edge is tempting but ends at a loose anchor; the other two make a stable route to the flower.

## Constraint

`tie A-B` works only when the spider is at anchor A or B and carrying an unused silk strand. The action moves the strand from the spider to the world and changes the web graph. Tying from away, with no strand, or to the loose anchor is a visible no-op or snap. The flower blooms only after a stable two-edge connection.

## Feedback Loop

The spider walks to an anchor, silk visibly leaves its abdomen, and a new edge appears. Rain then travels along the edge; a loose edge snaps when the spider pulls it. The run stops with the spider and broken edge visible for repair.

## Natural Computational Need

The problem is constructing a small mutable graph through an actor. The program describes visits and tie operations, while the web—not a hidden adjacency table—shows the resulting connectivity.

## Possible Underlying Patterns

Graph construction, resource consumption, adjacency, path connectivity, and guarded object mutation.

## Dumb Solution

Try the three possible pairs of edges and observe which one snaps. A fixed successful tie sequence is a valid solution once the loose anchor is understood.

## Intended Aha

The spider is the network builder. The program cannot simply declare two nodes connected; it must move the spider, spend silk, and leave a physical edge behind.

## Known Weaknesses

The graph is intentionally tiny. The loose anchor makes the choice readable but reduces the need for sophisticated network algorithms.
