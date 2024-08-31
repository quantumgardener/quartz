export const RemoveDrafts = () => ({
    name: "RemoveDrafts",
    shouldPublish(_ctx, [_tree, vfile]) {
        const draftFlag = vfile.data?.frontmatter?.draft || false;
        return !draftFlag;
    },
});
