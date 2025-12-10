import mongoose from 'mongoose';
/*
/*
* Script for seeding db with large dataset -
* 1000+ risks and 20 categories
* */

import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Risk } from '../models/risk.js';
import { Category } from '../models/category.js';
import connectDB from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load risks data from JSON file
const risksData = JSON.parse(readFileSync(join(__dirname, 'large-data.json'), 'utf-8'));

//chance.word()
function randomString(length: number): string {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i += 1) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

function generateRandomRisks(
	count: number,
	categories: Array<{ _id: mongoose.Types.ObjectId }>
): Array<{ name: string; description: string; categoryId: mongoose.Types.ObjectId; createdBy: string; resolved: boolean }> {
	const categoryIds = categories.map((cat) => cat._id);
	return Array.from({ length: count }, (_, idx) => {
		const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
		return {
			name: `Auto Risk ${idx + 1} ${randomString(6)}`,
			description: `Generated risk description ${randomString(24)}`,
			categoryId,
			createdBy: `auto-${randomString(8)}`,
			resolved: Math.random() > 0.5,
		};
	});
}

const categoriesData = [
	{
		name: 'Security',
		description: 'Security-related risks including vulnerabilities, breaches, and access control issues',
		createdBy: 'security-team',
	},
	{
		name: 'Operational',
		description: 'Operational risks including system failures, process inefficiencies, and resource constraints',
		createdBy: 'operations-team',
	},
	{
		name: 'Financial',
		description: 'Financial risks including budget overruns, cost management, and revenue impacts',
		createdBy: 'finance-team',
	},
	{
		name: 'Compliance',
		description: 'Compliance risks including regulatory violations, audit failures, and legal requirements',
		createdBy: 'compliance-officer',
	},
	{
		name: 'Technology',
		description: 'Technology risks including infrastructure failures, technical debt, and integration issues',
		createdBy: 'cto',
	},
	{
		name: 'Human Resources',
		description: 'HR risks including talent retention, skill gaps, and organizational changes',
		createdBy: 'hr-director',
	},
	{
		name: 'Legal',
		description: 'Legal risks including contract disputes, intellectual property issues, and litigation',
		createdBy: 'legal-counsel',
	},
	{
		name: 'Environmental',
		description: 'Environmental risks including sustainability concerns, resource consumption, and climate impact',
		createdBy: 'sustainability-manager',
	},
	{
		name: 'Strategic',
		description: 'Strategic risks including market changes, competitive threats, and business model disruptions',
		createdBy: 'ceo',
	},
	{
		name: 'Reputational',
		description: 'Reputational risks including brand damage, public relations issues, and customer trust',
		createdBy: 'pr-manager',
	},
	{
		name: 'Architecture',
		description: 'System architecture risks including scalability, maintainability, and design decisions',
		createdBy: 'cto',
	},
	{
		name: 'Innovation',
		description: 'Innovation risks including R&D investments, technology adoption, and competitive differentiation',
		createdBy: 'cto',
	},
	{
		name: 'Data Management',
		description: 'Data management risks including data quality, governance, and lifecycle management',
		createdBy: 'cto',
	},
	{
		name: 'Platform',
		description: 'Platform risks including infrastructure reliability, vendor management, and service delivery',
		createdBy: 'cto',
	},
	{
		name: 'Digital Transformation',
		description: 'Digital transformation risks including change management, technology integration, and process modernization',
		createdBy: 'cto',
	},
	{
		name: 'Quality Assurance',
		description: 'Quality assurance risks including testing gaps, defect management, and quality control processes',
		createdBy: 'qa-manager',
	},
	{
		name: 'Vendor Management',
		description: 'Vendor management risks including supplier dependencies, contract management, and vendor performance',
		createdBy: 'procurement-director',
	},
	{
		name: 'Business Continuity',
		description: 'Business continuity risks including disaster recovery, crisis management, and operational resilience',
		createdBy: 'operations-manager',
	},
	{
		name: 'Customer Experience',
		description: 'Customer experience risks including service quality, customer satisfaction, and user engagement',
		createdBy: 'customer-success-manager',
	},
	{
		name: 'Supply Chain',
		description: 'Supply chain risks including logistics, inventory management, and supplier relationships',
		createdBy: 'supply-chain-manager',
	},
];

async function seedDatabase(): Promise<void> {
	try {
		// Connect to database
		await connectDB();

		// Clear existing data
		console.log('Clearing existing data...');
		await Risk.deleteMany({});
		await Category.deleteMany({});
		console.log('Existing data cleared.');

		// Create categories
		console.log('Creating categories...');
		const createdCategories = await Category.insertMany(categoriesData);
		console.log(`Created ${createdCategories.length} categories.`);

		// Create a map of category names to IDs
		const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
		createdCategories.forEach((cat) => {
			categoryMap[cat.name] = cat._id;
		});

		// Create risks with category references
		console.log('Creating risks...');
		const risksToInsert = risksData.map((risk: { name: string; description: string; categoryName: string; createdBy: string; resolved: boolean }) => ({
			name: risk.name,
			description: risk.description,
			categoryId: categoryMap[risk.categoryName],
			createdBy: risk.createdBy,
			resolved: risk.resolved || false,
		}));

		const additionalRisks = generateRandomRisks(600, createdCategories);
		const allRisksToInsert = [...risksToInsert, ...additionalRisks];

		const createdRisks = await Risk.insertMany(allRisksToInsert);
		console.log(`Created ${createdRisks.length} risks.`);

		// Display summary
		console.log('\n=== Seeding Summary ===');
		console.log(`Categories created: ${createdCategories.length}`);
		console.log(`Risks created: ${createdRisks.length}`);
		console.log(`\nRisks by category:`);
		const risksByCategory = createdRisks.reduce((acc: Record<string, number>, risk) => {
			const key = risk.categoryId.toString();
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		}, {});

		createdCategories.forEach((cat) => {
			const count = risksByCategory[cat._id.toString()] || 0;
			console.log(`  ${cat.name}: ${count}`);
		});

		const resolvedCount = createdRisks.filter((r) => r.resolved).length;
		console.log(`\nResolved risks: ${resolvedCount}`);
		console.log(`Unresolved risks: ${createdRisks.length - resolvedCount}`);

		console.log('\n✅ Database seeded successfully!');
		process.exit(0);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('❌ Error seeding database:', errorMessage);
		process.exit(1);
	}
}

seedDatabase();
