# Premise

At a busy market, a belt sends arriving parcels toward a courier. Each parcel has a marking that matches exactly one stall. Keep the rush moving by sending every parcel to its matching stall.

# Player Decision

For each parcel, choose one of the four stall buttons whose mark matches the parcel’s mark.

# Constraint

There is one parcel at a time and a 75-second rush timer. A wrong route costs three seconds, but the parcel remains available to retry.

# Feedback Loop

Correct deliveries visibly add stock to the selected stall, advance the belt, update the progress bar, and bring in the next parcel. A wrong choice shakes the parcel, highlights the correct stall, names the evidence, and leaves the parcel in place.

# Natural Computational Need

The market needs a stable routing lookup: each parcel mark must resolve to one stall, repeatedly and in a changing arrival order.

# Possible Underlying Patterns

Lookup table/map, keyed dispatch, a decision table, or a small switch/if chain.

# Dumb Solution

Read each parcel, scan all four stalls, and manually click the matching one every time. This works, but it makes the repeated relationship easy to lose under time pressure.

# Intended Aha

The order of parcels is noise. The useful rule is simply “mark in, matching stall out”; once that relationship is noticed, every delivery becomes a quick lookup instead of a fresh search.

# Known Weaknesses

The four marks are always visible on the stalls, so the challenge is lightweight. The fixed parcel sequence limits replay variety, and the timer/penalty supplies urgency more than deep strategy.
