namespace $.$$ {
	interface Branch {
		id: any
		leafs: Leaf[]
	}

	function is_branch(obj: any): obj is Branch {
		return "leafs" in obj
	}

	interface Leaf {
		id: any
		title: string
		branches: Branch[]
	}

	function is_leaf(obj: any): obj is Leaf {
		return "branches" in obj
	}

	type Node = Branch | Leaf;

	export class $rm_app extends $.$rm_app {
		@ $mol_mem
		tree(): Branch[] {
			const random_id = this.$.$mol_guid;

			return [
				{
					id: random_id(),
					leafs: [
						{
							id: random_id(),
							title: "Здесь вы видите...",
							branches: [
								{
									id: random_id(),
									leafs: [
										{
											id: random_id(),
											title: "... различные узлы",
											branches: [
												{
													id: random_id(),
													leafs: [
														{
															id: random_id(),
															title: "Которые могут быть вложенными",
															branches: []
														}
													]
												}
											]
										},
										{
											id: random_id(),
											title: "А могут и не быть вложенными узлами произвольной длины, чтобы создать скролл",
											branches: []
										}
									]
								}
							]
						},
					]
				}
			]
		}

		@ $mol_mem
		branches(): readonly ($rm_tree_branch)[] {
			const branches = this.tree().map(branch => this.Branch(branch.id))

			return branches
		}

		@ $mol_mem
		leafs(id: any): readonly ($.$rm_tree_leaf)[] {
			const branch = this.tree_node(id)

			if (branch == null || is_leaf(branch)) {
				return []
			}

			const leafs = branch.leafs.map(leaf => this.Leaf(leaf.id)) ?? []

			return leafs
		}

		@ $mol_mem
		leaf_branches(id: any): readonly ($rm_tree_branch)[] {
			const leaf = this.tree_node(id);

			if (leaf == null || is_branch(leaf)) {
				return []
			}

			const branches = leaf.branches.map(branch => this.Branch(branch.id)) ?? []

			return branches
		}

		@ $mol_mem
		leaf_title(id: any): string {
			const node = this.tree_node(id)

			if (node == null || is_branch(node)) {
				return "..."
			}

			return node.title ?? "..."
		}

		@ $mol_mem
		tree_node(id: any, branches?: Branch[]): Node | null {
			if (!branches) {
				branches = this.tree()
			}

			for (const branch of branches) {
				if (branch.id == id) {
					return branch;
				}

				for (const leaf of branch.leafs) {
					if (leaf.id == id) {
						return leaf;
					}

					const node_in_nested_branches = this.tree_node(id, leaf.branches);

					if (node_in_nested_branches) {
						return node_in_nested_branches;
					}
				}
			}

			return null;
		}
	}
}
