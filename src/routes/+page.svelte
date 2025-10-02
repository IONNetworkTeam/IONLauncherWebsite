<script>
    import { onMount } from 'svelte';
    import { fetchLatestReleases } from './components/fetchLatestRelease.js';
    import { detectOS, getOSPlatformName } from './components/osDetection.js';
    import { getCopyrightText } from './components/copyright.js';
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
    import * as Tooltip from "$lib/components/ui/tooltip";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    //   Major Components
    import Dock from "./components/Dock.svelte";
    import DockIcon from "./components/DockIcon.svelte";
    import DotPattern from "./components/DotPattern.svelte";

    const copyrightText = getCopyrightText('ION Network Team', 2016);

    let downloadLinks = {
        Windows: null,
        MacOS: null,
        Linux: null,
    };

    let userOS = '';
    let error = '';
    let showVersionPopup = false;
    let selectedPlatform = '';
    let showImageModal = false;
    let selectedImage = null;

    onMount(async () => {
        try {
            downloadLinks = await fetchLatestReleases();
            userOS = detectOS();
        } catch (e) {
            error = 'Failed to load download links. Please try again later.';
            console.error(e);
        }
    });

    function openVersionSelector(platform) {
        const options = versionOptions[platform] || [];
        const availableOptions = options.filter(option => option.url);

        // If only one option is available, download directly
        if (availableOptions.length === 1) {
            handleDownload(availableOptions[0].url);
            return;
        }

        // If multiple options or no options, show popup
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

    function openImageModal(screenshot) {
        selectedImage = screenshot;
        showImageModal = true;
        document.body.style.overflow = 'hidden';
    }

    function closeImageModal() {
        showImageModal = false;
        selectedImage = null;
        document.body.style.overflow = 'auto';
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            if (showImageModal) {
                closeImageModal();
            } else if (showVersionPopup) {
                closeVersionPopup();
            }
        }
    }

    const allPlatforms = [
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
    ];

    $: navs = {
        // Reorder platforms based on detected OS
        navbar: (() => {
            const userPlatformName = getOSPlatformName(userOS);
            const userPlatform = allPlatforms.find(p => p.platform === userPlatformName);
            const otherPlatforms = allPlatforms.filter(p => p.platform !== userPlatformName);

            return userPlatform ? [userPlatform, ...otherPlatforms] : allPlatforms;
        })(),
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

    // Rest of your existing code (features, screenshots, etc.)
    const features = [
        {
            title: "Automatic Java installation",
            description: "If you have an incompatible version of Java installed, we'll install the right one for you.",
            icon: "☕"
        },
        {
            title: "Cross-Platform",
            description: "Available on Windows, macOS (x64 and ARM), and Linux (Flatpak and AppImage).",
            icon: "🌍"
        },
        {
            title: "Full account management",
            description: "Add multiple accounts and easily switch between them. Credentials are never stored and transmitted directly to Mojang.",
            icon: "🔒"
        },
        {
            title: "Auto Updates",
            description: "Automatic updates ensure you always have the latest features and security patches.",
            icon: "🔄"
        },
        {
            title: "Supports all our Servers",
            description: "Switch between server configurations with ease. View the player count of the selected server.",
            icon: "🖥️"
        },
        {
            title: "View Mojang status",
            description: "Check the current status of Mojang services directly from the launcher.",
            icon: "📡"
        }
    ];

    const screenshots = [
        {
            src: "/screenshots/launcher-main.png",
            alt: "ION Launcher Main Interface",
            title: "Main Interface"
        },
        {
            src: "/screenshots/automatic-java-selection.png",
            alt: "Automatic Java Selection",
            title: "Java Selection"
        },
        {
            src: "/screenshots/mod-section.png",
            alt: "Mod Selection Interface",
            title: "Mod Selection"
        },
        {
            src: "/screenshots/account-management.png",
            alt: "Account Management",
            title: "Account Management"
        }
    ];
</script>


<svelte:window on:keydown={handleKeydown} />

<div class="dark bg-black min-h-screen">
    <!-- Hero Section -->
     <section id="hero" class="relative flex flex-col items-center justify-center min-h-screen bg-black md:shadow-xl" style="background-image: url('wallpaper.png'); background-size: cover; background-position: center;">
         <DotPattern class="[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]" />

         <!-- Logo -->
         <img
             src="/IONLauncherLogo.png"
             alt="ION Launcher Logo"
             class="w-32 h-32 md:w-48 md:h-48 mb-2 object-contain"
         />

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
         <div class="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
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
                Take a look at ION Launcher in action. Click to enlarge.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                {#each screenshots as screenshot}
                    <button
                        on:click={() => openImageModal(screenshot)}
                        class="group relative overflow-hidden rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all duration-300 cursor-pointer"
                    >
                        <img
                            src={screenshot.src}
                            alt={screenshot.alt}
                            class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                                <h3 class="text-white text-xl font-semibold mb-2">{screenshot.title}</h3>
                                <div class="text-gray-300 text-sm flex items-center justify-center">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                    Click to enlarge
                                </div>
                            </div>
                        </div>
                    </button>
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
            <p class="text-gray-500">{copyrightText}</p>
        </div>
    </footer>
</div>

<!-- Image Modal -->
{#if showImageModal && selectedImage}
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm" on:click={closeImageModal}>
        <div class="relative max-w-[95vw] max-h-[95vh] m-4">
            <button
                on:click={closeImageModal}
                class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                class="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl"
                on:click|stopPropagation
            />

            <div class="absolute -bottom-16 left-0 right-0 text-center">
                <h3 class="text-white text-xl font-semibold mb-1">{selectedImage.title}</h3>
                <p class="text-gray-400 text-sm">Press ESC or click outside to close</p>
            </div>
        </div>
    </div>
{/if}

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
