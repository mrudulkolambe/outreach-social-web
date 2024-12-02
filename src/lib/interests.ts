export interface InterestType {
	interest: string;
	icon: string;
	category: string;
	tag: string;
}

const interestsOptions: InterestType[] = [
	{
		interest: "Mindfulness and Meditation",
		category: "Mindfulness & Meditation",
		icon: "assets/interests/mindfulness-and-meditation.svg",
		tag: "MindfulnessAndMeditation",
	},
	{
		interest: "Holistic Health",
		category: "Holistic Health",
		icon: "assets/interests/holistic-health.svg",
		tag: "HolisticHealth",
	},
	{
		interest: "Sleep Health",
		category: "Sleep Health",
		icon: "assets/interests/sleep-health.svg",
		tag: "SleepHealth",
	},
	{
		interest: "Stress Management",
		category: "Stress Management",
		icon: "assets/interests/stress-management.svg",
		tag: "StressManagement",
	},
	{
		interest: "Men's Health",
		category: "Men's Health",
		icon: "assets/interests/mens-health.svg",
		tag: "MensHealth",
	},
	{
		interest: "Heart Health",
		category: "Heart Health",
		icon: "assets/interests/heart-health.svg",
		tag: "HeartHealth",
	},
	{
		interest: "Women's Health",
		category: "Women's Health",
		icon: "assets/interests/womens-health.svg",
		tag: "WomensHealth",
	},
	{
		interest: "Hearing Health",
		category: "Hearing Health",
		icon: "assets/interests/hearing-health.svg",
		tag: "HearingHealth",
	},
	{
		interest: "Vision Care",
		category: "Vision Care",
		icon: "assets/interests/vision-care.svg",
		tag: "VisionCare",
	},
	{
		interest: "Chronic Disease Management",
		category: "Chronic Disease Management",
		icon: "assets/interests/chronic-disease.svg",
		tag: "ChronicDiseaseManagement",
	},
	{
		interest: "Healthy Cooking and Recipes",
		category: "Healthy Cooking & Recipes",
		icon: "assets/interests/healthy-cooking.svg",
		tag: "HealthyCookingAndRecipes",
	},
	{
		interest: "Alternative Medicine",
		category: "Alternative Medicine",
		icon: "assets/interests/alternative-medicine.svg",
		tag: "AlternativeMedicine",
	},
	{
		interest: "Rehabilitation and Recovery",
		category: "Rehabilitation & Recovery",
		icon: "assets/interests/rehabilation.svg",
		tag: "RehabilitationAndRecovery",
	},
	{
		interest: "Skin Care and Beauty",
		category: "Skin Care & Beauty",
		icon: "assets/interests/skin-care.svg",
		tag: "SkinCareAndBeauty",
	},
	{
		interest: "Respiratory Health",
		category: "Respiratory Health",
		icon: "assets/interests/respiratory-health.svg",
		tag: "RespiratoryHealth",
	},
	{
		interest: "Immune System Support",
		category: "Immune System Support",
		icon: "assets/interests/immune-system.svg",
		tag: "ImmuneSystemSupport",
	},
	{
		interest: "Cognitive Health and Brain Fitness",
		category: "Cognitive Health & Brain Fitness",
		icon: "assets/interests/cognitive-health.svg",
		tag: "CognitiveHealthAndBrainFitness",
	},
	{
		interest: "Sexual Health and Wellness",
		category: "Sexual Health & Wellness",
		icon: "assets/interests/sexual-health.svg",
		tag: "SexualHealthAndWellness",
	},
	{
		interest: "Dental Health and Oral Hygiene",
		category: "Dental Health & Oral Hygiene",
		icon: "assets/interests/dental-health.svg",
		tag: "DentalHealthAndOralHygiene",
	},
	{
		interest: "Addiction Recovery",
		category: "Addiction Recovery",
		icon: "assets/interests/addiction.svg",
		tag: "AddictionRecovery",
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