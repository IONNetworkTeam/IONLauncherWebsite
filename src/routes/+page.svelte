<script>
    import { onMount } from 'svelte';
    import { fetchLatestReleases } from './components/fetchLatestRelease.js';

    let downloadLinks = {
        Windows: null,
        MacOS: null,
        Linux: null,
    };

    let userOS = '';
    let error = '';

    onMount(async () => {
        try {
            downloadLinks = await fetchLatestReleases();
            userOS = getUserOS();
        } catch (e) {
            error = 'Failed to load download links. Please try again later.';
            console.error(e);
        }
    });

    function getUserOS() {
        const platform = navigator.platform.toLowerCase();
        if (platform.indexOf('win') !== -1) return 'Windows';
        if (platform.indexOf('mac') !== -1) return 'MacOS';
        if (platform.indexOf('linux') !== -1 || platform.indexOf('x11') !== -1) return 'Linux';
        return 'Unknown';
    }

    import DiscordSvg from "$lib/svg/web/discord.svg";
    import GithubSvg from "$lib/svg/web/github.svg";
    import YoutubeSvg from "$lib/svg/web/youtube.svg";
    import InstagramSvg from "$lib/svg/web/instagram.svg";
    import LinuxSvg from "$lib/svg/web/linux.svg";
    import AppleSvg from "$lib/svg/web/apple.svg";
    import WindowsSvg from "$lib/svg/web/windows.svg";
    //    Shadcn Components
    import * as Tooltip from "$lib/components/ui/tooltip";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    //   Major Components
    import Dock from "./components/Dock.svelte";
    import DockIcon from "./components/DockIcon.svelte";
    import DotPattern from "./components/DotPattern.svelte";

    $: navs = {
        navbar: [
            {
                label: "Windows",
                icon: WindowsSvg,
                href: downloadLinks.Windows ? downloadLinks.Windows.downloadUrl : null,
            },
            {
                label: "Linux",
                icon: LinuxSvg,
                href: downloadLinks.Linux ? downloadLinks.Linux.downloadUrl : null,
            },
            {
                label: "MacOS",
                icon: AppleSvg,
                href: downloadLinks.MacOS ? downloadLinks.MacOS.downloadUrl : null,
            },
        ],
        contact: [
            {
                label: "Github",
                icon: GithubSvg,
                href: "https://github.com/IONNetworkTeam/IONLauncher",
            },
            {
                label: "Discord",
                icon: DiscordSvg,
                href: "https://discord.ion-network.de",
            },
            {
                label: "Youtube",
                icon: YoutubeSvg,
                href: "https://youtube.ion-network.de",
            },
            {
                label: "Instagram",
                icon: InstagramSvg,
                href: "https://instagram.ion-network.de",
            },
        ],
    };
</script>

<div class="dark relative flex h-[100vh] w-[100vw] flex-col items-center justify-center overflow-hidden bg-black md:shadow-xl" style="background-image: url('wallpaper.png'); background-size: cover; background-position: center;">
    <DotPattern class="[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]" />

    <span class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl md:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        ION Launcher
    </span>
    <div>
        <Dock direction="middle" class="relative" let:mouseX let:distance let:magnification>
            {#each navs.navbar as item}
                <a href={item.href}>
                    <DockIcon {mouseX} {magnification} {distance}>
                        <Tooltip.Root>
                            <Tooltip.Trigger class="hover:bg-zinc-900/80 transition-all duration-200 rounded-full">
                                <img src={item.icon} alt={item.label} class="m-3 h-5 w-5 text-white" style="fill: white;" />
                            </Tooltip.Trigger>
                            <Tooltip.Content sideOffset={9}>
                                <p>{item.label}</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
                    </DockIcon>
                </a>
            {/each}
        </Dock>
    </div>
</div>