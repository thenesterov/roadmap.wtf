namespace $.$$ {
	export class $rm_app extends $.$rm_app {
		@ $mol_mem
		tree(): any[] {
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
	}
}
