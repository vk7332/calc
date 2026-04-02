import React from 'react';

const AboutPage: React.FC = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-navy-dark rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">About VKCalc.in</h1>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
            <strong>VKCalc.in</strong> is a CA-grade Indian tax and finance suite for AY 2026-27, designed for professionals and individuals. It offers accurate calculators, analytics, and export tools, all in a modern, user-friendly web app.
        </p>
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-200">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-200">To empower every Indian with professional-grade, up-to-date tax and finance tools, making compliance and planning simple, transparent, and accessible to all.</p>
        </div>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-200">
            <li>Latest tax slabs and deduction logic (AY 2026-27)</li>
            <li>Secure, privacy-first data handling</li>
            <li>Instant PDF export and sharing</li>
            <li>Mobile-friendly, PWA-enabled</li>
            <li>Direct support via WhatsApp and email</li>
            <li>AI-powered assistant for queries</li>
            <li>Comparison mode and analytics dashboard</li>
        </ul>
        <div className="mt-6 mb-4">
            <h2 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-200">Meet the Team</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
                <li><strong>Vikas K.</strong> – Founder, CA, Tax Expert</li>
                <li><strong>VKCalc.in Community</strong> – Contributors & Users</li>
            </ul>
        </div>
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Version: 2026.04.01</span><br />
            <span>Last updated: April 1, 2026</span>
        </div>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            For feedback or support, WhatsApp <a href="https://wa.me/917018064385" className="underline text-green-600">7018064385</a> or email <a href="mailto:vkcalc.in@gmail.com" className="underline text-pink-600">vkcalc.in@gmail.com</a>.
        </p>
    </div>
);

export default AboutPage;
