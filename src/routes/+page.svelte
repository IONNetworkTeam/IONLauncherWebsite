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
    let showVersionPopup = false;
    let selectedPlatform = '';

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

    function openVersionSelector(platform) {
        selectedPlatform = platform;
        showVersionPopup = true;
    }

    function closeVersionPopup() {
        showVersionPopup = false;
        selectedPlatform = '';
    }

    function handleDownload(url) {
        if (url) {
            window.open(url, '_blank');
        }
        closeVersionPopup();
    }

    function scrollToSection(sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }

    import DiscordSvg from "$lib/svg/web/discord.svg";
    import GithubSvg from "$lib/svg/web/github.svg";
    import YoutubeSvg from "$lib/svg/web/youtube.svg";
    import InstagramSvg from "$lib/svg/web/instagram.svg";
    import LinuxSvg from "$lib/svg/web/linux.svg";
    import AppleSvg from "$lib/svg/web/apple.svg";
    import WindowsSvg from "$lib/svg/web/windows.svg";
    import MacArmSvg from "$lib/svg/web/mac-arm.svg";
    import MacX64Svg from "$lib/svg/web/mac-x64.svg";
    import FlatpakSvg from "$lib/svg/web/flatpak.svg";
    import AppimageSvg from "$lib/svg/web/appimage.svg";
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
                platform: "Windows"
            },
            {
                label: "Linux",
                icon: LinuxSvg,
                platform: "Linux"
            },
            {
                label: "MacOS",
                icon: AppleSvg,
                platform: "MacOS"
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

    $: versionOptions = {
        Linux: [
            {
                label: "Flatpak",
                icon: FlatpakSvg,
                url: downloadLinks.Linux?.flatpakUrl || null
            },
            {
                label: "AppImage",
                icon: AppimageSvg,
                url: downloadLinks.Linux?.appimageUrl || null
            }
        ],
        MacOS: [
            {
                label: "ARM (Apple Silicon)",
                icon: MacArmSvg,
                url: downloadLinks.MacOS?.armUrl || null
            },
            {
                label: "x64 (Intel)",
                icon: MacX64Svg,
                url: downloadLinks.MacOS?.x64Url || null
            }
        ],
        Windows: [
            {
                label: "Windows Installer",
                icon: WindowsSvg,
                url: downloadLinks.Windows?.downloadUrl || null
            }
        ]
    };

    // Features data
    const features = [
        {
            title: "Fast & Efficient",
            description: "Lightning-fast startup and optimized performance for all your gaming needs.",
            icon: "⚡"
        },
        {
            title: "Cross-Platform",
            description: "Available on Windows, macOS, and Linux with native performance on each platform.",
            icon: "🌍"
        },
        {
            title: "Easy Management",
            description: "Intuitive interface for managing your game library and mods with just a few clicks.",
            icon: "🎮"
        },
        {
            title: "Auto Updates",
            description: "Automatic updates ensure you always have the latest features and security patches.",
            icon: "🔄"
        },
        {
            title: "Mod Support",
            description: "Built-in mod manager with support for popular modding platforms and tools.",
            icon: "🔧"
        },
        {
            title: "Cloud Sync",
            description: "Sync your settings and saves across multiple devices with cloud integration.",
            icon: "☁️"
        }
    ];

    // Screenshots data - replace with your actual screenshot paths
    const screenshots = [
        {
            src: "/screenshots/launcher-main.png",
            alt: "ION Launcher Main Interface",
            title: "Main Interface"
        },
        {
            src: "/screenshots/game-library.png",
            alt: "Game Library View",
            title: "Game Library"
        },
        {
            src: "/screenshots/mod-manager.png",
            alt: "Mod Manager Interface",
            title: "Mod Manager"
        },
        {
            src: "/screenshots/settings.png",
            alt: "Settings Panel",
            title: "Settings"
        }
    ];
</script>

<div class="dark bg-black min-h-screen">
    <!-- Hero Section -->
    <section id="hero" class="relative flex h-[100vh] w-[100vw] flex-col items-center justify-center overflow-hidden bg-black md:shadow-xl" style="background-image: url('wallpaper.png'); background-size: cover; background-position: center;">
        <DotPattern class="[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]" />

        <span class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl md:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            ION Launcher
        </span>

        <div class="mb-8">
            <Dock direction="middle" class="relative" let:mouseX let:distance let:magnification>
                {#each navs.navbar as item}
                    <button on:click={() => openVersionSelector(item.platform)}>
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
                    </button>
                {/each}
            </Dock>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button on:click={() => scrollToSection('features')} class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </button>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 px-4 bg-zinc-950">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-4xl md:text-6xl font-bold text-white text-center mb-4">Features</h2>
            <p class="text-gray-400 text-xl text-center mb-16 max-w-3xl mx-auto">
                Discover what makes ION Launcher the perfect choice for your gaming setup
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each features as feature}
                    <div class="bg-zinc-900 border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all duration-300 hover:transform hover:-translate-y-1">
                        <div class="text-4xl mb-4">{feature.icon}</div>
                        <h3 class="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                        <p class="text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Screenshots Section -->
    <section id="screenshots" class="py-20 px-4 bg-black">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-4xl md:text-6xl font-bold text-white text-center mb-4">Screenshots</h2>
            <p class="text-gray-400 text-xl text-center mb-16 max-w-3xl mx-auto">
                Take a look at ION Launcher in action
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                {#each screenshots as screenshot}
                    <div class="group relative overflow-hidden rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all duration-300">
                        <img
                            src={screenshot.src}
                            alt={screenshot.alt}
                            class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                            <h3 class="text-white text-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {screenshot.title}
                            </h3>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Contact/Social Section -->
    <section id="contact" class="py-20 px-4 bg-zinc-950">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-4xl md:text-6xl font-bold text-white mb-4">Stay Connected</h2>
            <p class="text-gray-400 text-xl mb-12">
                Join our community and stay updated with the latest news and updates
            </p>

            <div class="flex justify-center items-center space-x-6">
                {#each navs.contact as social}
                    <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center justify-center w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-full hover:border-zinc-600 hover:bg-zinc-700 transition-all duration-200 group"
                    >
                        <img src={social.icon} alt={social.label} class="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
                    </a>
                {/each}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 px-4 bg-black border-t border-zinc-800">
        <div class="max-w-6xl mx-auto text-center">
            <p class="text-gray-500">© 2024 ION Network Team. All rights reserved.</p>
        </div>
    </footer>
</div>

<!-- Version Selection Popup -->
{#if showVersionPopup}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
        <div class="relative bg-zinc-900 rounded-lg p-8 max-w-md w-full mx-4 border border-zinc-700">
            <button
                on:click={closeVersionPopup}
                class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <h2 class="text-2xl font-semibold text-white mb-6">Select {selectedPlatform} Version</h2>

            <div class="space-y-4">
                {#each versionOptions[selectedPlatform] || [] as option}
                    <button
                        on:click={() => handleDownload(option.url)}
                        disabled={!option.url}
                        class="w-full flex items-center p-4 rounded-lg border border-zinc-600 hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <img src={option.icon} alt={option.label} class="w-8 h-8 mr-4" />
                        <div class="text-left">
                            <div class="text-white font-medium">{option.label}</div>
                            {#if !option.url}
                                <div class="text-red-400 text-sm">Not available</div>
                            {/if}
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    </div>
{/if}