<script lang="ts">
	import { tick } from 'svelte';

	type Props = {
		items: (string | number)[];
		value: string | number;
		expanded?: boolean;
	};
	// Default `expanded` state is back to `true` as in the original code.
	let { items = $bindable(), value = $bindable(), expanded = true }: Props = $props();

	// --- Component State ---
	let container: HTMLDivElement;
	let item_height = 0;
	let container_height = 0;
	let activeIndex = $state(0);
	let scrollTimeout: number;

	// --- Interaction State ---
	let isInteracting = false;
	let isDragging = $state(false);
	let startY: number;
	let startScrollTop: number;

	// --- Effects ---

	// Effect to calculate element dimensions
	$effect(() => {
		if (!container) return;
		const firstItem = container.querySelector('.item');
		if (!firstItem) return;
		item_height = (firstItem as HTMLDivElement).offsetHeight;
		container_height = container.offsetHeight;
	});

	// Effect to programmatically set scroll position when `value` changes EXTERNALLY
	$effect(() => {
		if (isInteracting) {
			return;
		}

		if (container && item_height > 0 && items.length > 0) {
			const newIndex = items.indexOf(value);
			// Check if index is valid and different from the current one to avoid unnecessary scrolls
			if (newIndex !== -1 && newIndex !== activeIndex) {
				activeIndex = newIndex;
				tick().then(() => {
					const centerOffset = container_height / 2 - item_height / 2;
					container.scrollTo({
						top: activeIndex * item_height - centerOffset,
						behavior: 'smooth'
					});
				});
			}
		}
	});

	// --- Event Handlers for Drag-to-Scroll ---

	function handleMouseDown(event: MouseEvent) {
		isInteracting = true;
		isDragging = true;
		startY = event.clientY;
		startScrollTop = container.scrollTop;
		event.preventDefault();
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;
		const deltaY = event.clientY - startY;
		container.scrollTop = startScrollTop - deltaY;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleMouseLeave() {
		isDragging = false;
	}

	/**
	 * Unified scroll handler for all scroll types (wheel, drag, touch).
	 * It debounces the input to only update the state once scrolling has stopped.
	 */
	function handleScroll() {
		isInteracting = true;
		clearTimeout(scrollTimeout);

		scrollTimeout = setTimeout(() => {
			if (!container || !item_height) return;
			const centerOffset = container_height / 2 - item_height / 2;
			const currentIndex = Math.round((container.scrollTop + centerOffset) / item_height);
			const clampedIndex = Math.max(0, Math.min(currentIndex, items.length - 1));

			activeIndex = clampedIndex;
			value = items[clampedIndex] ?? items[0];
			isInteracting = false;
		}, 150);
	}
</script>

<!-- The root container no longer has its own click handlers or bindings -->
<div class="wheel-container" class:expanded>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="wheel"
		class:grabbing={isDragging}
		bind:this={container}
		onscroll={handleScroll}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseLeave}
	>
		{#each items as item, index}
			<div class="item" class:selected={index === activeIndex}>
				{item}
				{console.log(value)}
			</div>
		{/each}
	</div>
</div>

<!-- Styles are unchanged -->
<style>
	.wheel-container {
		height: 40px;
		position: relative;
		overflow: hidden;
		transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		mask-image: none;
	}
	.wheel-container.expanded {
		height: 120px;
		mask-image: linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%);
	}
	.wheel-container:not(.expanded) .wheel {
		pointer-events: none;
		touch-action: none;
	}
	.wheel-container::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		height: 2.5rem;
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 0.25rem;
		z-index: -1;
		pointer-events: none;
	}
	.wheel {
		height: 100%;
		overflow-y: scroll;
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
		-ms-overflow-style: none;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior-y: contain;
		cursor: grab;
		user-select: none;
	}

	.wheel::before,
.wheel::after {
    content: '';
    display: block;
    height: calc(50% - 1.25rem); /* half the container height minus half item height */
}


	.wheel.grabbing {
		cursor: grabbing;
	}

	.wheel::-webkit-scrollbar {
		display: none;
	}
	.item {
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		scroll-snap-align: center;
		font-size: 18px;
		color: #13478bff;
		font-weight: 500;
		transition:
			color 0.4s ease,
			font-weight 0.4s ease,
			font-size 0.4s ease,
			transform 0.4s ease;
	}
	.item.selected {
		color: #099fdaff;
		font-weight: 600;
		font-size: large;
		transform: scale(1.05);
	}
</style>