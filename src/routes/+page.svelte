<script lang="ts">
  import { File, Folder, FolderOpen } from "lucide-svelte";

  let { data } = $props();

  let { host, items } = data;

  let folders: string[] = $state([]);
  let files: string[] = $state([]);

  let allDirectories: string[] = $state([]);
  let allFiles: Array<{ name: string; directory: string }> = $state([]);
  let currentFolder: string | null = $state(null);

  // Process items into directory and file structure
  $effect(() => {
    const directories = new Set<string>();
    const files: Array<{ name: string; directory: string }> = [];

    items.forEach((item) => {
      const parts = item.split("/");
      if (parts.length === 1) {
        // Root file
        files.push({ name: parts[0], directory: "" });
      } else {
        // Nested file
        const fileName = parts.pop()!;
        const directory = parts.join("/");
        files.push({ name: fileName, directory });

        // Build directory hierarchy
        let currentPath = "";
        for (const part of parts) {
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          directories.add(currentPath);
        }
      }
    });

    allDirectories = Array.from(directories);
    allFiles = files;
  });

  $effect(() => {
    const current = currentFolder ?? "";

    folders = allDirectories.filter((dir) => {
      const parent = dir.split("/").slice(0, -1).join("/");
      return parent === current;
    });

    files = allFiles
      .filter((file) => file.directory === current)
      .map((file) => file.name);
  });

  // Helper to navigate up directories
  function navigateUp() {
    if (!currentFolder) return;
    const parts = currentFolder.split("/");
    parts.pop();
    currentFolder = parts.length > 0 ? parts.join("/") : null;
  }

  // Helper to get folder name from path
  function getFolderName(path: string) {
    return path.split("/").pop();
  }
</script>

<main class="bg-zinc-950 text-white min-h-screen px-8 pt-2">
  <div class=" mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1
        class="text-3xl font-bold text-white bg-zinc-900 p-4 rounded-lg shadow-lg">
        {host}
      </h1>
      <!-- <input
        type="text"
        placeholder="Search..."
        class="p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-purple-500" /> -->
    </div>

    {#key currentFolder}
      <div class="bg-zinc-900 px-6 rounded-lg shadow-lg">
        <table class="table-auto w-full text-left">
          <thead class="text-gray-400">
            <tr>
              <th class="py-2">File Name</th>
              <th class="py-2">Size</th>
            </tr>
          </thead>
          <tbody>
            {#if currentFolder}
              <tr class="border-t border-zinc-800">
                <td class="py-2 text-blue-300 text-xl">
                  <button onclick={navigateUp}
                    ><div class="flex inline-flex hover:underline">
                      <FolderOpen class="mr-2" strokeWidth={2} />
                      ...
                    </div></button>
                </td>
                <td class="py-2">-</td>
              </tr>
            {/if}
            {#each folders as folder}
              <tr class="border-t border-zinc-800">
                <td class="py-2 text-blue-300 text-xl">
                  <button onclick={() => (currentFolder = folder)}>
                    <div class="flex inline-flex hover:underline">
                      <Folder class="mr-2" strokeWidth={2} />
                      {folder}/
                    </div></button>
                </td>
                <td class="py-2">-</td>
              </tr>
            {/each}

            {#each files as file}
              <tr class="border-t border-zinc-800">
                <td class="py-2 text-green-300 text-xl">
                  <a
                    class=""
                    href="https://{host}/{currentFolder
                      ? currentFolder + '/'
                      : ''}{file}"
                    target="_blank"
                    ><div class="flex inline-flex hover:underline">
                      <File class="mr-2" strokeWidth={2} />
                      {file}
                    </div></a
                  ></td>
                <td class="py-2">-</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/key}
  </div>
</main>
