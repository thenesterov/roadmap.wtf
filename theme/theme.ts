namespace $ {
	type Rem = number;
	type Px = number;

	export function $rm_theme_rem(rem: Rem): Px {
		return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
	}
}
