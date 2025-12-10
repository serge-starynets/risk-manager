import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: [
		// Try to fetch from running server first, fallback to schema file
		process.env.VITE_API_URL ? `${process.env.VITE_API_URL}/graphql` : 'http://localhost:4000/graphql',
		// Fallback: use schema file from server directory
		'../risk-manager-server/src/schema.ts',
	],
	documents: ['src/**/*.{ts,tsx}'],
	generates: {
		'./src/api/generated/': {
			preset: 'client',
			plugins: [],
			presetConfig: {
				gqlTagName: 'gql',
			},
		},
		'./src/api/generated/hooks.tsx': {
			plugins: ['add', 'typescript', 'typescript-operations', 'typescript-react-apollo'],
			config: {
				add: {
					content: '// @ts-nocheck',
					placement: 'prepend',
				},
				withHooks: true,
				withComponent: false,
				withHOC: false,
				apolloClientVersion: 4,
				apolloClientImportFrom: '@apollo/client/react',
				skipTypename: false,
				scalars: {
					ID: 'string',
				},
			},
		},
	},
	ignoreNoDocuments: true,
};

export default config;
