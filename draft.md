Drafts of retention policies specifically for deletions

### Without Delete Activities ### {#without-deletions}

When this retention policy is in place, a harvester MUST check for implicit deletions.

Issue: A `ldes:ImplicitDeletionPolicy` has been proposed that will force LDES clients to check for deleted members: https://github.com/SEMICeu/LinkedDataEventStreams/issues/50

### Partial Delete activities ### {#some-deletions}

The list of deleted datasets can get quite big in the long run without big benefits.
You MAY indicate to a harvester that you will only publish delete activities for a specific duration,
but publish all latest version of anything else.

Issue: This feature is under discussion as this cannot currently be processed in LDES: https://github.com/SEMICeu/LinkedDataEventStreams/issues/50
