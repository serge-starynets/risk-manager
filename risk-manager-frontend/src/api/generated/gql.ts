/* eslint-disable */
import * as types from './graphql';
import type {TypedDocumentNode as DocumentNode} from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n\tquery GetCategories($createdBy: String, $first: Int, $after: String) {\n\t\tcategories(createdBy: $createdBy, first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tcreatedBy\n\t\t\t\t\tcreatedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t\tcursor\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalCount\n\t\t\t}\n\t\t}\n\t}\n": typeof types.GetCategoriesDocument,
    "\n\tquery GetAllCategories {\n\t\tallCategories {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": typeof types.GetAllCategoriesDocument,
    "\n\tmutation DeleteCategory($id: ID!) {\n\t\tdeleteCategory(id: $id)\n\t}\n": typeof types.DeleteCategoryDocument,
    "\n\tmutation CreateCategory($name: String!, $description: String, $createdBy: String!) {\n\t\tcreateCategory(name: $name, description: $description, createdBy: $createdBy) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t}\n\t}\n": typeof types.CreateCategoryDocument,
    "\n\tmutation UpdateCategory($id: ID!, $name: String, $description: String) {\n\t\tupdateCategory(id: $id, name: $name, description: $description) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": typeof types.UpdateCategoryDocument,
    "\n\tquery GetRisks($createdBy: String, $first: Int, $after: String) {\n\t\trisks(createdBy: $createdBy, first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tcategory {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t\tresolved\n\t\t\t\t\tcreatedBy\n\t\t\t\t\tcreatedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t\tcursor\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalCount\n\t\t\t}\n\t\t}\n\t}\n": typeof types.GetRisksDocument,
    "\n\tmutation DeleteRisk($id: ID!) {\n\t\tdeleteRisk(id: $id)\n\t}\n": typeof types.DeleteRiskDocument,
    "\n\tmutation CreateRisk($name: String!, $description: String, $categoryId: ID!, $createdBy: String!, $resolved: Boolean) {\n\t\tcreateRisk(name: $name, description: $description, categoryId: $categoryId, createdBy: $createdBy, resolved: $resolved) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcategoryId\n\t\t\tresolved\n\t\t\tcreatedBy\n\t\t}\n\t}\n": typeof types.CreateRiskDocument,
    "\n\tmutation UpdateRisk($id: ID!, $name: String, $description: String, $categoryId: ID, $resolved: Boolean) {\n\t\tupdateRisk(id: $id, name: $name, description: $description, categoryId: $categoryId, resolved: $resolved) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcategory {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tresolved\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": typeof types.UpdateRiskDocument,
};
const documents: Documents = {
    "\n\tquery GetCategories($createdBy: String, $first: Int, $after: String) {\n\t\tcategories(createdBy: $createdBy, first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tcreatedBy\n\t\t\t\t\tcreatedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t\tcursor\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalCount\n\t\t\t}\n\t\t}\n\t}\n": types.GetCategoriesDocument,
    "\n\tquery GetAllCategories {\n\t\tallCategories {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": types.GetAllCategoriesDocument,
    "\n\tmutation DeleteCategory($id: ID!) {\n\t\tdeleteCategory(id: $id)\n\t}\n": types.DeleteCategoryDocument,
    "\n\tmutation CreateCategory($name: String!, $description: String, $createdBy: String!) {\n\t\tcreateCategory(name: $name, description: $description, createdBy: $createdBy) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t}\n\t}\n": types.CreateCategoryDocument,
    "\n\tmutation UpdateCategory($id: ID!, $name: String, $description: String) {\n\t\tupdateCategory(id: $id, name: $name, description: $description) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": types.UpdateCategoryDocument,
    "\n\tquery GetRisks($createdBy: String, $first: Int, $after: String) {\n\t\trisks(createdBy: $createdBy, first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tcategory {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t\tresolved\n\t\t\t\t\tcreatedBy\n\t\t\t\t\tcreatedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t\tcursor\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalCount\n\t\t\t}\n\t\t}\n\t}\n": types.GetRisksDocument,
    "\n\tmutation DeleteRisk($id: ID!) {\n\t\tdeleteRisk(id: $id)\n\t}\n": types.DeleteRiskDocument,
    "\n\tmutation CreateRisk($name: String!, $description: String, $categoryId: ID!, $createdBy: String!, $resolved: Boolean) {\n\t\tcreateRisk(name: $name, description: $description, categoryId: $categoryId, createdBy: $createdBy, resolved: $resolved) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcategoryId\n\t\t\tresolved\n\t\t\tcreatedBy\n\t\t}\n\t}\n": types.CreateRiskDocument,
    "\n\tmutation UpdateRisk($id: ID!, $name: String, $description: String, $categoryId: ID, $resolved: Boolean) {\n\t\tupdateRisk(id: $id, name: $name, description: $description, categoryId: $categoryId, resolved: $resolved) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcategory {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tresolved\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": types.UpdateRiskDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCategories($createdBy: String, $first: Int, $after: String) {\n\t\tcategories(createdBy: $createdBy, first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tcreatedBy\n\t\t\t\t\tcreatedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t\tcursor\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalCount\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCategories($createdBy: String, $first: Int, $after: String) {\n\t\tcategories(createdBy: $createdBy, first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tcreatedBy\n\t\t\t\t\tcreatedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t\tcursor\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalCount\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetAllCategories {\n\t\tallCategories {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetAllCategories {\n\t\tallCategories {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation DeleteCategory($id: ID!) {\n\t\tdeleteCategory(id: $id)\n\t}\n"): (typeof documents)["\n\tmutation DeleteCategory($id: ID!) {\n\t\tdeleteCategory(id: $id)\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation CreateCategory($name: String!, $description: String, $createdBy: String!) {\n\t\tcreateCategory(name: $name, description: $description, createdBy: $createdBy) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreateCategory($name: String!, $description: String, $createdBy: String!) {\n\t\tcreateCategory(name: $name, description: $description, createdBy: $createdBy) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation UpdateCategory($id: ID!, $name: String, $description: String) {\n\t\tupdateCategory(id: $id, name: $name, description: $description) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UpdateCategory($id: ID!, $name: String, $description: String) {\n\t\tupdateCategory(id: $id, name: $name, description: $description) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetRisks($createdBy: String, $first: Int, $after: String) {\n\t\trisks(createdBy: $createdBy, first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tcategory {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t\tresolved\n\t\t\t\t\tcreatedBy\n\t\t\t\t\tcreatedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t\tcursor\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalCount\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetRisks($createdBy: String, $first: Int, $after: String) {\n\t\trisks(createdBy: $createdBy, first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tcategory {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t\tresolved\n\t\t\t\t\tcreatedBy\n\t\t\t\t\tcreatedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t\tcursor\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalCount\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation DeleteRisk($id: ID!) {\n\t\tdeleteRisk(id: $id)\n\t}\n"): (typeof documents)["\n\tmutation DeleteRisk($id: ID!) {\n\t\tdeleteRisk(id: $id)\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation CreateRisk($name: String!, $description: String, $categoryId: ID!, $createdBy: String!, $resolved: Boolean) {\n\t\tcreateRisk(name: $name, description: $description, categoryId: $categoryId, createdBy: $createdBy, resolved: $resolved) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcategoryId\n\t\t\tresolved\n\t\t\tcreatedBy\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreateRisk($name: String!, $description: String, $categoryId: ID!, $createdBy: String!, $resolved: Boolean) {\n\t\tcreateRisk(name: $name, description: $description, categoryId: $categoryId, createdBy: $createdBy, resolved: $resolved) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcategoryId\n\t\t\tresolved\n\t\t\tcreatedBy\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation UpdateRisk($id: ID!, $name: String, $description: String, $categoryId: ID, $resolved: Boolean) {\n\t\tupdateRisk(id: $id, name: $name, description: $description, categoryId: $categoryId, resolved: $resolved) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcategory {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tresolved\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UpdateRisk($id: ID!, $name: String, $description: String, $categoryId: ID, $resolved: Boolean) {\n\t\tupdateRisk(id: $id, name: $name, description: $description, categoryId: $categoryId, resolved: $resolved) {\n\t\t\tid\n\t\t\tname\n\t\t\tdescription\n\t\t\tcategory {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tresolved\n\t\t\tcreatedBy\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;