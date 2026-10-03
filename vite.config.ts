// Merged by `gtkx dev`. Keep the watcher out of `gtkx deploy` output: the Flatpak
// build tree under build/ contains symlink loops that crash the dev server.
export default {
    server: {
        watch: {
            ignored: ["**/build/**"],
        },
    },
};
