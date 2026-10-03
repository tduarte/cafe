import { defineConfig } from "@gtkx/config";

export default defineConfig({
    applicationId: "io.github.tduarte.cafe",
    applicationIcon: "data/icons",
    future: {
        v2ByteArrays: true,
        v2ValueReturns: true,
        v2FinishResults: true,
        v2InoutReturns: true,
        v2ResourceImports: true,
        v2DefaultLibraries: true,
        v2TreeShaking: true,
    },
    deploy: {
        name: "Cafe",
        binaryName: "cafe",
        summary: "Coffee beans and water ratio calculator",
        description: [
            "Cafe calculates how much coffee and water to use for Espresso, Pour Over, French Press, "
            + "and AeroPress. Enter either amount and the other is filled in, in metric or imperial units.",
        ],
        categories: ["Utility"],
        developer: { id: "io.github.tduarte", name: "Thiago Duarte" },
        homepage: "https://github.com/tduarte/cafe",
        targets: ["flatpak"],
    },
});
