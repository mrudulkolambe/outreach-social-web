export interface InterestType {
	interest: string;
	icon: string;
	category: string;
}

const interestsOptions: InterestType[] = [
	{
		interest: "Mindfulness and Meditation",
		category: "Mindfulness & Meditation",
		icon: "assets/interests/mindfulness-and-meditation.svg",
	},
	{
		interest: "Holistic Health",
		category: "Holistic Health",
		icon: "assets/interests/holistic-health.svg",
	},
	{
		interest: "Sleep Health",
		category: "Sleep Health",
		icon: "assets/interests/sleep-health.svg",
	},
	{
		interest: "Stress Management",
		category: "Stress Management",
		icon: "assets/interests/stress-management.svg",
	},
	{
		interest: "Men's Health",
		category: "Men's Health",
		icon: "assets/interests/mens-health.svg",
	},
	{
		interest: "Heart Health",
		category: "Heart Health",
		icon: "assets/interests/heart-health.svg",
	},
	{
		interest: "Women's Health",
		category: "Women's Health",
		icon: "assets/interests/womens-health.svg",
	},
	{
		interest: "Hearing Health",
		category: "Hearing Health",
		icon: "assets/interests/hearing-health.svg",
	},
	{
		interest: "Vision Care",
		category: "Vision Care",
		icon: "assets/interests/vision-care.svg",
	},
	{
		interest: "Chronic Disease Management",
		category: "Chronic Disease Management",
		icon: "assets/interests/chronic-disease.svg",
	},
	{
		interest: "Healthy Cooking and Recipes",
		category: "Healthy Cooking & Recipes",
		icon: "assets/interests/healthy-cooking.svg",
	},
	{
		interest: "Alternative Medicine",
		category: "Alternative Medicine",
		icon: "assets/interests/alternative-medicine.svg",
	},
	{
		interest: "Rehabilitation and Recovery",
		category: "Rehabilitation & Recovery",
		icon: "assets/interests/rehabilation.svg",
	},
	{
		interest: "Skin Care and Beauty",
		category: "Skin Care & Beauty",
		icon: "assets/interests/skin-care.svg",
	},
	{
		interest: "Respiratory Health",
		category: "Respiratory Health",
		icon: "assets/interests/respiratory-health.svg",
	},
	{
		interest: "Immune System Support",
		category: "Immune System Support",
		icon: "assets/interests/immune-system.svg",
	},
	{
		interest: "Cognitive Health and Brain Fitness",
		category: "Cognitive Health & Brain Fitness",
		icon: "assets/interests/cognitive-health.svg",
	},
	{
		interest: "Sexual Health and Wellness",
		category: "Sexual Health & Wellness",
		icon: "assets/interests/sexual-health.svg",
	},
	{
		interest: "Dental Health and Oral Hygiene",
		category: "Dental Health & Oral Hygiene",
		icon: "assets/interests/dental-health.svg",
	},
	{
		interest: "Addiction Recovery",
		category: "Addiction Recovery",
		icon: "assets/interests/addiction.svg",
	},
];

export function handleInterests(interests: string[]): InterestType[] {
	const filteredInterests = interestsOptions.filter(interestType =>
		interests.includes(interestType.interest)
	);
	console.log(filteredInterests.length);
	return filteredInterests;
}

export default interestsOptions