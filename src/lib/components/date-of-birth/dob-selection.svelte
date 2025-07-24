<script lang="ts">
	import ScrollPicker from "../scroll-picker.svelte";

	let isDateExpanded = $state(false);
	let isTimeExpanded = $state(false);

	let month = $state("FEB");
	let day = $state(18);
	let year = $state(1998);
	let hour = $state(22);
	let minute = $state(54);
	let second = $state(1);

	const originalMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	const months = Array(1).fill(originalMonths).flat();
	const originalDates = Array.from({ length: 31 }, (_, i) => i + 1);
	const dates = Array(1).fill(originalDates).flat();
	const currentYear = new Date().getFullYear();
	const originalYears = Array.from({ length: 120 }, (_, i) => currentYear - i);
	const years = Array(1).fill(originalYears).flat();
	const originalHours = Array.from({ length: 24 }, (_, i) => i);
	const hours = Array(1).fill(originalHours).flat();
	const originalMinutesSeconds = Array.from({ length: 60 }, (_, i) => i);
	const minutes_seconds = Array(1).fill(originalMinutesSeconds).flat();
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-10">
	<div
		class="w-full max-w-xl rounded-2xl border border-zinc-700 bg-zinc-900/70 p-6 shadow-2xl ring-1 ring-zinc-800 backdrop-blur-sm transition duration-300 hover:scale-[1.01]"
	>
		<h2 class="mb-6 text-center font-cinzel text-2xl font-bold text-white/90 drop-shadow-sm">📅 Select Date & Time</h2>

		<!-- Date Picker Section -->
		<div class="mb-6 space-y-3 rounded-xl bg-zinc-800/40 p-4 shadow-inner ring-1 ring-zinc-700/60">
			<div class="grid grid-cols-3 text-center text-sm font-semibold text-white/70">
				<span>Month</span>
				<span>Day</span>
				<span>Year</span>
			</div>

			<div
				class="mt-1 grid cursor-pointer grid-cols-3 gap-x-2 rounded-lg border border-zinc-600 bg-black/30 ring-1 ring-zinc-700 focus-within:outline-none"
				onclick={() => (isDateExpanded = !isDateExpanded)}
				onfocusout={() => (isDateExpanded = false)}
				tabindex="0"
			>
				<ScrollPicker bind:value={month} items={months} expanded={isDateExpanded} />
				<ScrollPicker bind:value={day} items={dates} expanded={isDateExpanded} />
				<ScrollPicker bind:value={year} items={years} expanded={isDateExpanded} />
			</div>
		</div>

		<!-- Time Picker Section -->
		<div class="space-y-3 rounded-xl bg-zinc-800/40 p-4 shadow-inner ring-1 ring-zinc-700/60">
			<div class="grid grid-cols-3 text-center text-sm font-semibold text-white/70">
				<span>Hour</span>
				<span>Minute</span>
				<span>Second</span>
			</div>

			<div
				class="mt-1 grid cursor-pointer grid-cols-3 gap-x-2 rounded-lg border border-zinc-600 bg-black/30 ring-1 ring-zinc-700 focus-within:outline-none"
				onclick={() => (isTimeExpanded = !isTimeExpanded)}
				onfocusout={() => (isTimeExpanded = false)}
				tabindex="0"
			>
				<ScrollPicker bind:value={hour} items={hours} expanded={isTimeExpanded} />
				<ScrollPicker bind:value={minute} items={minutes_seconds} expanded={isTimeExpanded} />
				<ScrollPicker bind:value={second} items={minutes_seconds} expanded={isTimeExpanded} />
			</div>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&display=swap');

	:global(body) {
		font-family: system-ui, sans-serif;
	}

	:global(.font-cinzel) {
		font-family: 'Cinzel', serif;
	}
</style>
