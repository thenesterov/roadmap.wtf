namespace $.$$ {
	export class $rm_tree_leaf extends $.$rm_tree_leaf {
		show_connection_path(next?: FocusEvent) {
			this.connection_path(next?.target as any)
		}

		hide_connection_path(next?: any) {
			this.connection_path(null);
		}
	}
}
