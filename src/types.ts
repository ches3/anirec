type Title = {
	workTitle: string;
	episodeTitle: string;
};

type SearchResult =
	| {
			id: string;
			title: string;
			episode:
				| {
						id: string;
						title: string | undefined;
				  }
				| undefined;
	  }
	| undefined;
