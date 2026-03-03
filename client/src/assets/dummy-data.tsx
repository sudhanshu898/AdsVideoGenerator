import { UploadIcon, VideoIcon, ZapIcon } from 'lucide-react';

export const featuresData = [
    {
        icon: <UploadIcon className="w-6 h-6" />,
        title: 'Smart Upload',
        desc: 'Upload product image and a model photo - our AI instantly produces professional lifestyle imagery and short-form videos.'
    },
    {
        icon: <ZapIcon className="w-6 h-6" />,
        title: 'Instant Creation',
        desc: 'Optimized models deliver output in seconds, ready for use in commercials, Reels and social media campaigns.'
    },
    {
        icon: <VideoIcon className="w-6 h-6" />,
        title: 'Video Synthesis',
        desc: 'Bring products to life with dynamic video content that engages audiences and drives conversions across all channels.'
    }
];

export const plansData = [
    {
        id: 'starter',
        name: 'Starter',
        price: '$12',
        desc: 'Try the platfrom at no cost.',
        credits: 25,
        features: [
            '25 credits',
            'Standard quality',
            'No watermark',
            'Slower generation speed',
            'Email support'
        ]
    },
    {
        id: 'pro',
        name: 'pro',
        price: '$20',
        desc: 'Creators & small teams',
        credits: 80,
        features: [
            '80 Credits',
            'HD quality',
            'No Watermark',
            'Video generation',
            'Priority support'
        ],
        popular: true
    },
    {
        id: 'ultra',
        name: 'Ultra',
        price: '$99',
        desc: 'Scale across teams and agencies.',
        credits: 300,
        features: [
            '300 credits',
            'FHD quality',
            'No Watermark',
            'Fast generation speed',
            'Chat + Email support'
        ]
    }
];

export const faqData = [
    {
        question: 'How does the AI generation work?',
        answer: 'We leverage advanced generative models trained on diverse datasets to create high-quality lifestyle imagery and videos from your product images. Our platform optimizes the output for commercial use and social media engagement.'
    },
    {
        question: 'Do I own the generated images?',
        answer: 'Yes. You retain full ownership and commercial rights to all generated content, allowing you to use it freely across your marketing channels.'
    },
    {
        question: 'Can I cancel anytime?',
        answer: 'Yes. You can cancel your subscription at any time without any penalties.'
    },
    {
        question: 'What input formats do you support?',
        answer: 'We support common image formats such as JPG, PNG, and WebP. For video content, we accept MP4 and MOV files.'
    }
];

export const footerLinks = [
    {
        title: "Quick Links",
        links: [
            { name: "Home", url: "#" },
            { name: "Features", url: "#" },
            { name: "Pricing", url: "#" },
            { name: "FAQ", url: "#" }
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", url: "#" },
            { name: "Terms of Service", url: "#" }
        ]
    },
    {
        title: "Connect",
        links: [
            { name: "Twitter", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "GitHub", url: "#" }
        ]
    }
];