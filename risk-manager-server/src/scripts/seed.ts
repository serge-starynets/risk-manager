import 'dotenv/config';
import mongoose from 'mongoose';
import { Risk } from '../models/risk.js';
import { Category } from '../models/category.js';
import connectDB from '../db.js';

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
];

const risksData = [
	// Security Risks (10 risks)
	{
		name: 'SQL Injection Vulnerability',
		description: 'Database queries are vulnerable to SQL injection attacks due to improper input sanitization',
		categoryName: 'Security',
		createdBy: 'security-auditor',
		resolved: false,
	},
	{
		name: 'Weak Password Policy',
		description: 'Current password policy allows weak passwords, increasing risk of unauthorized access',
		categoryName: 'Security',
		createdBy: 'security-team',
		resolved: false,
	},
	{
		name: 'Missing SSL/TLS Certificate',
		description: 'API endpoints are not using SSL/TLS encryption, exposing data in transit',
		categoryName: 'Security',
		createdBy: 'devops-engineer',
		resolved: true,
	},
	{
		name: 'Unauthorized API Access',
		description: 'API endpoints lack proper authentication mechanisms, allowing unauthorized access',
		categoryName: 'Security',
		createdBy: 'security-team',
		resolved: false,
	},
	{
		name: 'Cross-Site Scripting (XSS)',
		description: 'User input is not properly sanitized, allowing potential XSS attacks in web interface',
		categoryName: 'Security',
		createdBy: 'frontend-developer',
		resolved: false,
	},
	{
		name: 'Outdated Dependencies',
		description: 'Multiple npm packages contain known security vulnerabilities and need updates',
		categoryName: 'Security',
		createdBy: 'security-scanner',
		resolved: false,
	},
	{
		name: 'Exposed API Keys',
		description: 'API keys found in public repository, requiring immediate rotation and removal',
		categoryName: 'Security',
		createdBy: 'security-auditor',
		resolved: true,
	},
	{
		name: 'Insufficient Logging',
		description: 'Security events are not properly logged, making incident detection difficult',
		categoryName: 'Security',
		createdBy: 'security-team',
		resolved: false,
	},
	{
		name: 'Missing Rate Limiting',
		description: 'API endpoints lack rate limiting, vulnerable to brute force and DDoS attacks',
		categoryName: 'Security',
		createdBy: 'backend-developer',
		resolved: false,
	},
	{
		name: 'Insecure Data Storage',
		description: 'Sensitive user data stored in plaintext instead of encrypted format',
		categoryName: 'Security',
		createdBy: 'data-protection-officer',
		resolved: false,
	},
	{
		name: 'Database Performance Degradation',
		description: 'Query response times have increased by 300% over the past month, affecting user experience',
		categoryName: 'Operational',
		createdBy: 'database-admin',
		resolved: false,
	},
	{
		name: 'Single Point of Failure',
		description: 'Application relies on single database server without redundancy or failover mechanism',
		categoryName: 'Operational',
		createdBy: 'infrastructure-engineer',
		resolved: false,
	},
	{
		name: 'Insufficient Backup Strategy',
		description: 'Current backup frequency is weekly, which may result in significant data loss in case of failure',
		categoryName: 'Operational',
		createdBy: 'devops-team',
		resolved: true,
	},
	{
		name: 'High Server Load',
		description: 'CPU usage consistently above 85% during peak hours, risking service degradation',
		categoryName: 'Operational',
		createdBy: 'monitoring-system',
		resolved: false,
	},
	{
		name: 'Memory Leak in Production',
		description: 'Application memory usage gradually increases over time, requiring periodic restarts',
		categoryName: 'Operational',
		createdBy: 'backend-developer',
		resolved: false,
	},
	{
		name: 'Missing Error Handling',
		description: 'Several API endpoints lack proper error handling, causing unhandled exceptions',
		categoryName: 'Operational',
		createdBy: 'qa-engineer',
		resolved: false,
	},
	{
		name: 'Privilege Escalation Vulnerability',
		description: 'Users can escalate privileges through application logic flaw',
		categoryName: 'Security',
		createdBy: 'security-auditor',
		resolved: false,
	},
	{
		name: 'Session Hijacking Risk',
		description: 'Session tokens not properly secured, vulnerable to hijacking attacks',
		categoryName: 'Security',
		createdBy: 'security-team',
		resolved: false,
	},
	{
		name: 'Insecure Direct Object Reference',
		description: 'Application exposes internal object references without proper authorization checks',
		categoryName: 'Security',
		createdBy: 'security-scanner',
		resolved: false,
	},
	{
		name: 'CSRF Protection Missing',
		description: 'Forms lack CSRF tokens, vulnerable to cross-site request forgery',
		categoryName: 'Security',
		createdBy: 'frontend-developer',
		resolved: true,
	},
	{
		name: 'Insecure File Upload',
		description: 'File upload functionality allows malicious file execution',
		categoryName: 'Security',
		createdBy: 'security-auditor',
		resolved: false,
	},
	{
		name: 'Broken Authentication',
		description: 'Authentication mechanism has flaws allowing bypass or brute force attacks',
		categoryName: 'Security',
		createdBy: 'security-team',
		resolved: false,
	},
	{
		name: 'Missing Security Headers',
		description: 'HTTP security headers not configured, increasing attack surface',
		categoryName: 'Security',
		createdBy: 'devops-engineer',
		resolved: false,
	},
	{
		name: 'Insecure API Design',
		description: 'API endpoints expose sensitive operations without proper authentication',
		categoryName: 'Security',
		createdBy: 'backend-developer',
		resolved: false,
	},
	{
		name: 'Hardcoded Credentials',
		description: 'Application code contains hardcoded passwords and API keys',
		categoryName: 'Security',
		createdBy: 'security-auditor',
		resolved: false,
	},
	{
		name: 'Insufficient Input Validation',
		description: 'User inputs not properly validated, allowing malicious payloads',
		categoryName: 'Security',
		createdBy: 'frontend-developer',
		resolved: false,
	},
	{
		name: 'Missing Multi-Factor Authentication',
		description: 'Critical accounts lack MFA, increasing risk of unauthorized access',
		categoryName: 'Security',
		createdBy: 'security-team',
		resolved: false,
	},
	{
		name: 'Insecure Cookie Configuration',
		description: 'Cookies not marked as secure or HttpOnly, vulnerable to theft',
		categoryName: 'Security',
		createdBy: 'frontend-developer',
		resolved: true,
	},
	{
		name: 'Insufficient Access Controls',
		description: 'Role-based access controls not properly implemented across all endpoints',
		categoryName: 'Security',
		createdBy: 'security-auditor',
		resolved: false,
	},
	{
		name: 'Vulnerable Third-Party Integrations',
		description: 'Third-party services integrated without proper security assessment',
		categoryName: 'Security',
		createdBy: 'security-team',
		resolved: false,
	},
	{
		name: 'Incomplete Deployment Procedures',
		description: 'Deployment process lacks proper rollback mechanisms and testing',
		categoryName: 'Operational',
		createdBy: 'devops-team',
		resolved: true,
	},
	{
		name: 'Missing Health Check Endpoints',
		description: 'No health check endpoints for monitoring application status',
		categoryName: 'Operational',
		createdBy: 'backend-developer',
		resolved: false,
	},
	{
		name: 'Inefficient Database Queries',
		description: 'Multiple queries lack proper indexing, causing slow response times',
		categoryName: 'Operational',
		createdBy: 'database-admin',
		resolved: false,
	},
	{
		name: 'Insufficient Logging Infrastructure',
		description: 'Logging system cannot handle peak load, causing log loss',
		categoryName: 'Operational',
		createdBy: 'devops-engineer',
		resolved: false,
	},
	{
		name: 'Missing Automated Testing',
		description: 'Critical functionality lacks automated tests, increasing regression risk',
		categoryName: 'Operational',
		createdBy: 'qa-engineer',
		resolved: false,
	},
	{
		name: 'Inadequate Alerting System',
		description: 'Alerting system generates too many false positives, reducing effectiveness',
		categoryName: 'Operational',
		createdBy: 'operations-manager',
		resolved: false,
	},
	{
		name: 'Version Control Issues',
		description: 'Code repository lacks proper branching strategy and code review process',
		categoryName: 'Operational',
		createdBy: 'devops-team',
		resolved: false,
	},
	{
		name: 'Insufficient Scalability',
		description: 'Application architecture cannot scale horizontally to meet demand',
		categoryName: 'Operational',
		createdBy: 'infrastructure-engineer',
		resolved: false,
	},
	{
		name: 'Missing Performance Benchmarks',
		description: 'No performance benchmarks established, making optimization difficult',
		categoryName: 'Operational',
		createdBy: 'performance-engineer',
		resolved: false,
	},
	{
		name: 'Inadequate Change Management',
		description: 'No formal change management process, increasing deployment risks',
		categoryName: 'Operational',
		createdBy: 'operations-manager',
		resolved: false,
	},
	{
		name: 'Service Dependency Chain Risk',
		description: 'Critical service depends on multiple other services, creating cascade failure risk',
		categoryName: 'Operational',
		createdBy: 'system-architect',
		resolved: false,
	},
	{
		name: 'Missing Configuration Management',
		description: 'Application configurations not properly versioned or managed',
		categoryName: 'Operational',
		createdBy: 'devops-team',
		resolved: true,
	},
	{
		name: 'Insufficient Incident Response',
		description: 'No documented incident response procedures for production issues',
		categoryName: 'Operational',
		createdBy: 'operations-manager',
		resolved: false,
	},
	{
		name: 'Legacy System Integration Issues',
		description: 'Integration with legacy systems causing performance and reliability problems',
		categoryName: 'Operational',
		createdBy: 'integration-engineer',
		resolved: false,
	},
	{
		name: 'Vendor Payment Delays',
		description: 'Delays in vendor payments affecting supplier relationships',
		categoryName: 'Financial',
		createdBy: 'procurement-manager',
		resolved: false,
	},
	{
		name: 'Investment Portfolio Risk',
		description: 'Company investments exposed to market volatility',
		categoryName: 'Financial',
		createdBy: 'finance-director',
		resolved: false,
	},
	{
		name: 'Credit Risk Exposure',
		description: 'High exposure to customer credit defaults',
		categoryName: 'Financial',
		createdBy: 'credit-manager',
		resolved: false,
	},
	{
		name: 'Inflation Impact on Costs',
		description: 'Rising inflation increasing operational costs faster than revenue',
		categoryName: 'Financial',
		createdBy: 'finance-team',
		resolved: false,
	},
	{
		name: 'Fraud Detection Gaps',
		description: 'Insufficient fraud detection mechanisms in payment systems',
		categoryName: 'Financial',
		createdBy: 'security-team',
		resolved: true,
	},
	{
		name: 'Subscription Revenue Churn',
		description: 'High customer churn rate affecting recurring revenue',
		categoryName: 'Financial',
		createdBy: 'sales-director',
		resolved: false,
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
		const risksToInsert = risksData.map((risk) => ({
			name: risk.name,
			description: risk.description,
			categoryId: categoryMap[risk.categoryName],
			createdBy: risk.createdBy,
			resolved: risk.resolved || false,
		}));

		const createdRisks = await Risk.insertMany(risksToInsert);
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
