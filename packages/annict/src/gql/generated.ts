import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AnnictActivity = AnnictNode & {
  __typename?: 'Activity';
  annictId: Scalars['Int']['output'];
  /** ID of the object. */
  id: Scalars['ID']['output'];
  user: AnnictUser;
};

export enum AnnictActivityAction {
  Create = 'CREATE'
}

/** The connection type for Activity. */
export type AnnictActivityConnection = {
  __typename?: 'ActivityConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictActivityEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictActivity>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictActivityEdge = {
  __typename?: 'ActivityEdge';
  action: AnnictActivityAction;
  annictId: Scalars['Int']['output'];
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  item?: Maybe<AnnictActivityItem>;
  /** The item at the end of the edge. */
  node?: Maybe<AnnictActivity>;
  user: AnnictUser;
};

export type AnnictActivityItem = AnnictMultipleRecord | AnnictRecord | AnnictReview | AnnictStatus;

export type AnnictActivityOrder = {
  direction: AnnictOrderDirection;
  field: AnnictActivityOrderField;
};

export enum AnnictActivityOrderField {
  CreatedAt = 'CREATED_AT'
}

export type AnnictCast = AnnictNode & {
  __typename?: 'Cast';
  annictId: Scalars['Int']['output'];
  character: AnnictCharacter;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nameEn: Scalars['String']['output'];
  person: AnnictPerson;
  sortNumber: Scalars['Int']['output'];
  work: AnnictWork;
};

/** The connection type for Cast. */
export type AnnictCastConnection = {
  __typename?: 'CastConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictCastEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictCast>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictCastEdge = {
  __typename?: 'CastEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictCast>;
};

export type AnnictCastOrder = {
  direction: AnnictOrderDirection;
  field: AnnictCastOrderField;
};

export enum AnnictCastOrderField {
  CreatedAt = 'CREATED_AT',
  SortNumber = 'SORT_NUMBER'
}

export type AnnictChannel = AnnictNode & {
  __typename?: 'Channel';
  annictId: Scalars['Int']['output'];
  channelGroup: AnnictChannelGroup;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  programs?: Maybe<AnnictProgramConnection>;
  published: Scalars['Boolean']['output'];
  scChid: Scalars['Int']['output'];
};


export type AnnictChannelProgramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/** The connection type for Channel. */
export type AnnictChannelConnection = {
  __typename?: 'ChannelConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictChannelEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictChannel>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictChannelEdge = {
  __typename?: 'ChannelEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictChannel>;
};

export type AnnictChannelGroup = AnnictNode & {
  __typename?: 'ChannelGroup';
  annictId: Scalars['Int']['output'];
  channels?: Maybe<AnnictChannelConnection>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sortNumber: Scalars['Int']['output'];
};


export type AnnictChannelGroupChannelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type AnnictCharacter = AnnictNode & {
  __typename?: 'Character';
  age: Scalars['String']['output'];
  ageEn: Scalars['String']['output'];
  annictId: Scalars['Int']['output'];
  birthday: Scalars['String']['output'];
  birthdayEn: Scalars['String']['output'];
  bloodType: Scalars['String']['output'];
  bloodTypeEn: Scalars['String']['output'];
  description: Scalars['String']['output'];
  descriptionEn: Scalars['String']['output'];
  descriptionSource: Scalars['String']['output'];
  descriptionSourceEn: Scalars['String']['output'];
  favoriteCharactersCount: Scalars['Int']['output'];
  height: Scalars['String']['output'];
  heightEn: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nameEn: Scalars['String']['output'];
  nameKana: Scalars['String']['output'];
  nationality: Scalars['String']['output'];
  nationalityEn: Scalars['String']['output'];
  nickname: Scalars['String']['output'];
  nicknameEn: Scalars['String']['output'];
  occupation: Scalars['String']['output'];
  occupationEn: Scalars['String']['output'];
  series?: Maybe<AnnictSeries>;
  weight: Scalars['String']['output'];
  weightEn: Scalars['String']['output'];
};

/** The connection type for Character. */
export type AnnictCharacterConnection = {
  __typename?: 'CharacterConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictCharacterEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictCharacter>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictCharacterEdge = {
  __typename?: 'CharacterEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictCharacter>;
};

export type AnnictCharacterOrder = {
  direction: AnnictOrderDirection;
  field: AnnictCharacterOrderField;
};

export enum AnnictCharacterOrderField {
  CreatedAt = 'CREATED_AT',
  FavoriteCharactersCount = 'FAVORITE_CHARACTERS_COUNT'
}

/** Autogenerated input type of CreateRecord */
export type AnnictCreateRecordInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  episodeId: Scalars['ID']['input'];
  ratingState?: InputMaybe<AnnictRatingState>;
  shareFacebook?: InputMaybe<Scalars['Boolean']['input']>;
  shareTwitter?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Autogenerated return type of CreateRecord. */
export type AnnictCreateRecordPayload = {
  __typename?: 'CreateRecordPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  record?: Maybe<AnnictRecord>;
};

/** Autogenerated input type of CreateReview */
export type AnnictCreateReviewInput = {
  body: Scalars['String']['input'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ratingAnimationState?: InputMaybe<AnnictRatingState>;
  ratingCharacterState?: InputMaybe<AnnictRatingState>;
  ratingMusicState?: InputMaybe<AnnictRatingState>;
  ratingOverallState?: InputMaybe<AnnictRatingState>;
  ratingStoryState?: InputMaybe<AnnictRatingState>;
  shareFacebook?: InputMaybe<Scalars['Boolean']['input']>;
  shareTwitter?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  workId: Scalars['ID']['input'];
};

/** Autogenerated return type of CreateReview. */
export type AnnictCreateReviewPayload = {
  __typename?: 'CreateReviewPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  review?: Maybe<AnnictReview>;
};

/** Autogenerated input type of DeleteRecord */
export type AnnictDeleteRecordInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  recordId: Scalars['ID']['input'];
};

/** Autogenerated return type of DeleteRecord. */
export type AnnictDeleteRecordPayload = {
  __typename?: 'DeleteRecordPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  episode?: Maybe<AnnictEpisode>;
};

/** Autogenerated input type of DeleteReview */
export type AnnictDeleteReviewInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  reviewId: Scalars['ID']['input'];
};

/** Autogenerated return type of DeleteReview. */
export type AnnictDeleteReviewPayload = {
  __typename?: 'DeleteReviewPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  work?: Maybe<AnnictWork>;
};

/** An episode of a work */
export type AnnictEpisode = AnnictNode & {
  __typename?: 'Episode';
  annictId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  nextEpisode?: Maybe<AnnictEpisode>;
  number?: Maybe<Scalars['Int']['output']>;
  numberText?: Maybe<Scalars['String']['output']>;
  prevEpisode?: Maybe<AnnictEpisode>;
  recordCommentsCount: Scalars['Int']['output'];
  records?: Maybe<AnnictRecordConnection>;
  recordsCount: Scalars['Int']['output'];
  satisfactionRate?: Maybe<Scalars['Float']['output']>;
  sortNumber: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
  viewerDidTrack: Scalars['Boolean']['output'];
  viewerRecordsCount: Scalars['Int']['output'];
  work: AnnictWork;
};


/** An episode of a work */
export type AnnictEpisodeRecordsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hasComment?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictRecordOrder>;
};

/** The connection type for Episode. */
export type AnnictEpisodeConnection = {
  __typename?: 'EpisodeConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictEpisodeEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictEpisode>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictEpisodeEdge = {
  __typename?: 'EpisodeEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictEpisode>;
};

export type AnnictEpisodeOrder = {
  direction: AnnictOrderDirection;
  field: AnnictEpisodeOrderField;
};

export enum AnnictEpisodeOrderField {
  CreatedAt = 'CREATED_AT',
  SortNumber = 'SORT_NUMBER'
}

export type AnnictLibraryEntry = AnnictNode & {
  __typename?: 'LibraryEntry';
  id: Scalars['ID']['output'];
  nextEpisode?: Maybe<AnnictEpisode>;
  nextProgram?: Maybe<AnnictProgram>;
  note: Scalars['String']['output'];
  status?: Maybe<AnnictStatus>;
  user: AnnictUser;
  work: AnnictWork;
};

/** The connection type for LibraryEntry. */
export type AnnictLibraryEntryConnection = {
  __typename?: 'LibraryEntryConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictLibraryEntryEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictLibraryEntry>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictLibraryEntryEdge = {
  __typename?: 'LibraryEntryEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictLibraryEntry>;
};

export type AnnictLibraryEntryOrder = {
  direction: AnnictOrderDirection;
  field: AnnictLibraryEntryOrderField;
};

export enum AnnictLibraryEntryOrderField {
  /** 最後に記録またはスキップした日時 */
  LastTrackedAt = 'LAST_TRACKED_AT'
}

/** Media of anime */
export enum AnnictMedia {
  Movie = 'MOVIE',
  Other = 'OTHER',
  Ova = 'OVA',
  Tv = 'TV',
  Web = 'WEB'
}

export type AnnictMultipleRecord = AnnictNode & {
  __typename?: 'MultipleRecord';
  annictId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  records?: Maybe<AnnictRecordConnection>;
  user: AnnictUser;
  work: AnnictWork;
};


export type AnnictMultipleRecordRecordsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type AnnictMutation = {
  __typename?: 'Mutation';
  createRecord?: Maybe<AnnictCreateRecordPayload>;
  createReview?: Maybe<AnnictCreateReviewPayload>;
  deleteRecord?: Maybe<AnnictDeleteRecordPayload>;
  deleteReview?: Maybe<AnnictDeleteReviewPayload>;
  updateRecord?: Maybe<AnnictUpdateRecordPayload>;
  updateReview?: Maybe<AnnictUpdateReviewPayload>;
  updateStatus?: Maybe<AnnictUpdateStatusPayload>;
};


export type AnnictMutationCreateRecordArgs = {
  input: AnnictCreateRecordInput;
};


export type AnnictMutationCreateReviewArgs = {
  input: AnnictCreateReviewInput;
};


export type AnnictMutationDeleteRecordArgs = {
  input: AnnictDeleteRecordInput;
};


export type AnnictMutationDeleteReviewArgs = {
  input: AnnictDeleteReviewInput;
};


export type AnnictMutationUpdateRecordArgs = {
  input: AnnictUpdateRecordInput;
};


export type AnnictMutationUpdateReviewArgs = {
  input: AnnictUpdateReviewInput;
};


export type AnnictMutationUpdateStatusArgs = {
  input: AnnictUpdateStatusInput;
};

/** An object with an ID. */
export type AnnictNode = {
  /** ID of the object. */
  id: Scalars['ID']['output'];
};

export enum AnnictOrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type AnnictOrganization = AnnictNode & {
  __typename?: 'Organization';
  annictId: Scalars['Int']['output'];
  favoriteOrganizationsCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nameEn: Scalars['String']['output'];
  nameKana: Scalars['String']['output'];
  staffsCount: Scalars['Int']['output'];
  twitterUsername?: Maybe<Scalars['String']['output']>;
  twitterUsernameEn: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlEn: Scalars['String']['output'];
  wikipediaUrl?: Maybe<Scalars['String']['output']>;
  wikipediaUrlEn: Scalars['String']['output'];
};

/** The connection type for Organization. */
export type AnnictOrganizationConnection = {
  __typename?: 'OrganizationConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictOrganizationEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictOrganization>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictOrganizationEdge = {
  __typename?: 'OrganizationEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictOrganization>;
};

export type AnnictOrganizationOrder = {
  direction: AnnictOrderDirection;
  field: AnnictOrganizationOrderField;
};

export enum AnnictOrganizationOrderField {
  CreatedAt = 'CREATED_AT',
  FavoriteOrganizationsCount = 'FAVORITE_ORGANIZATIONS_COUNT'
}

/** Information about pagination in a connection. */
export type AnnictPageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type AnnictPerson = AnnictNode & {
  __typename?: 'Person';
  annictId: Scalars['Int']['output'];
  birthday?: Maybe<Scalars['String']['output']>;
  bloodType?: Maybe<Scalars['String']['output']>;
  castsCount: Scalars['Int']['output'];
  favoritePeopleCount: Scalars['Int']['output'];
  genderText?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nameEn: Scalars['String']['output'];
  nameKana: Scalars['String']['output'];
  nickname?: Maybe<Scalars['String']['output']>;
  nicknameEn: Scalars['String']['output'];
  prefecture?: Maybe<AnnictPrefecture>;
  staffsCount: Scalars['Int']['output'];
  twitterUsername?: Maybe<Scalars['String']['output']>;
  twitterUsernameEn: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlEn: Scalars['String']['output'];
  wikipediaUrl?: Maybe<Scalars['String']['output']>;
  wikipediaUrlEn: Scalars['String']['output'];
};

/** The connection type for Person. */
export type AnnictPersonConnection = {
  __typename?: 'PersonConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictPersonEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictPerson>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictPersonEdge = {
  __typename?: 'PersonEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictPerson>;
};

export type AnnictPersonOrder = {
  direction: AnnictOrderDirection;
  field: AnnictPersonOrderField;
};

export enum AnnictPersonOrderField {
  CreatedAt = 'CREATED_AT',
  FavoritePeopleCount = 'FAVORITE_PEOPLE_COUNT'
}

export type AnnictPrefecture = AnnictNode & {
  __typename?: 'Prefecture';
  annictId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type AnnictProgram = AnnictNode & {
  __typename?: 'Program';
  annictId: Scalars['Int']['output'];
  channel: AnnictChannel;
  episode: AnnictEpisode;
  id: Scalars['ID']['output'];
  rebroadcast: Scalars['Boolean']['output'];
  scPid?: Maybe<Scalars['Int']['output']>;
  startedAt: Scalars['DateTime']['output'];
  state: AnnictProgramState;
  work: AnnictWork;
};

/** The connection type for Program. */
export type AnnictProgramConnection = {
  __typename?: 'ProgramConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictProgramEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictProgram>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictProgramEdge = {
  __typename?: 'ProgramEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictProgram>;
};

export type AnnictProgramOrder = {
  direction: AnnictOrderDirection;
  field: AnnictProgramOrderField;
};

export enum AnnictProgramOrderField {
  StartedAt = 'STARTED_AT'
}

export enum AnnictProgramState {
  Hidden = 'HIDDEN',
  Published = 'PUBLISHED'
}

export type AnnictQuery = {
  __typename?: 'Query';
  /** Fetches an object given its ID. */
  node?: Maybe<AnnictNode>;
  /** Fetches a list of objects given a list of IDs. */
  nodes: Array<Maybe<AnnictNode>>;
  searchCharacters?: Maybe<AnnictCharacterConnection>;
  searchEpisodes?: Maybe<AnnictEpisodeConnection>;
  searchOrganizations?: Maybe<AnnictOrganizationConnection>;
  searchPeople?: Maybe<AnnictPersonConnection>;
  searchWorks?: Maybe<AnnictWorkConnection>;
  user?: Maybe<AnnictUser>;
  viewer?: Maybe<AnnictUser>;
};


export type AnnictQueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type AnnictQueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type AnnictQuerySearchCharactersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annictIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  names?: InputMaybe<Array<Scalars['String']['input']>>;
  orderBy?: InputMaybe<AnnictCharacterOrder>;
};


export type AnnictQuerySearchEpisodesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annictIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictEpisodeOrder>;
};


export type AnnictQuerySearchOrganizationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annictIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  names?: InputMaybe<Array<Scalars['String']['input']>>;
  orderBy?: InputMaybe<AnnictOrganizationOrder>;
};


export type AnnictQuerySearchPeopleArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annictIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  names?: InputMaybe<Array<Scalars['String']['input']>>;
  orderBy?: InputMaybe<AnnictPersonOrder>;
};


export type AnnictQuerySearchWorksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annictIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictWorkOrder>;
  seasons?: InputMaybe<Array<Scalars['String']['input']>>;
  titles?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type AnnictQueryUserArgs = {
  username: Scalars['String']['input'];
};

export enum AnnictRatingState {
  Average = 'AVERAGE',
  Bad = 'BAD',
  Good = 'GOOD',
  Great = 'GREAT'
}

export type AnnictRecord = AnnictNode & {
  __typename?: 'Record';
  annictId: Scalars['Int']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  commentsCount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  episode: AnnictEpisode;
  facebookClickCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  likesCount: Scalars['Int']['output'];
  modified: Scalars['Boolean']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  ratingState?: Maybe<AnnictRatingState>;
  twitterClickCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: AnnictUser;
  work: AnnictWork;
};

/** The connection type for Record. */
export type AnnictRecordConnection = {
  __typename?: 'RecordConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictRecordEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictRecord>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictRecordEdge = {
  __typename?: 'RecordEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictRecord>;
};

export type AnnictRecordOrder = {
  direction: AnnictOrderDirection;
  field: AnnictRecordOrderField;
};

export enum AnnictRecordOrderField {
  CreatedAt = 'CREATED_AT',
  LikesCount = 'LIKES_COUNT'
}

export type AnnictReview = AnnictNode & {
  __typename?: 'Review';
  annictId: Scalars['Int']['output'];
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  impressionsCount: Scalars['Int']['output'];
  likesCount: Scalars['Int']['output'];
  modifiedAt?: Maybe<Scalars['DateTime']['output']>;
  ratingAnimationState?: Maybe<AnnictRatingState>;
  ratingCharacterState?: Maybe<AnnictRatingState>;
  ratingMusicState?: Maybe<AnnictRatingState>;
  ratingOverallState?: Maybe<AnnictRatingState>;
  ratingStoryState?: Maybe<AnnictRatingState>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: AnnictUser;
  work: AnnictWork;
};

/** The connection type for Review. */
export type AnnictReviewConnection = {
  __typename?: 'ReviewConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictReviewEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictReview>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictReviewEdge = {
  __typename?: 'ReviewEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictReview>;
};

export type AnnictReviewOrder = {
  direction: AnnictOrderDirection;
  field: AnnictReviewOrderField;
};

export enum AnnictReviewOrderField {
  CreatedAt = 'CREATED_AT',
  LikesCount = 'LIKES_COUNT'
}

/** Season name */
export enum AnnictSeasonName {
  Autumn = 'AUTUMN',
  Spring = 'SPRING',
  Summer = 'SUMMER',
  Winter = 'WINTER'
}

export type AnnictSeries = AnnictNode & {
  __typename?: 'Series';
  annictId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nameEn: Scalars['String']['output'];
  nameRo: Scalars['String']['output'];
  works?: Maybe<AnnictSeriesWorkConnection>;
};


export type AnnictSeriesWorksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictSeriesWorkOrder>;
};

/** The connection type for Series. */
export type AnnictSeriesConnection = {
  __typename?: 'SeriesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictSeriesEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictSeries>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictSeriesEdge = {
  __typename?: 'SeriesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictSeries>;
};

/** The connection type for Work. */
export type AnnictSeriesWorkConnection = {
  __typename?: 'SeriesWorkConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictSeriesWorkEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictWork>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictSeriesWorkEdge = {
  __typename?: 'SeriesWorkEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  item: AnnictWork;
  /** The item at the end of the edge. */
  node?: Maybe<AnnictWork>;
  summary?: Maybe<Scalars['String']['output']>;
  summaryEn?: Maybe<Scalars['String']['output']>;
};

export type AnnictSeriesWorkOrder = {
  direction: AnnictOrderDirection;
  field: AnnictSeriesWorkOrderField;
};

export enum AnnictSeriesWorkOrderField {
  Season = 'SEASON'
}

export type AnnictStaff = AnnictNode & {
  __typename?: 'Staff';
  annictId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nameEn: Scalars['String']['output'];
  resource: AnnictStaffResourceItem;
  roleOther: Scalars['String']['output'];
  roleOtherEn: Scalars['String']['output'];
  roleText: Scalars['String']['output'];
  sortNumber: Scalars['Int']['output'];
  work: AnnictWork;
};

/** The connection type for Staff. */
export type AnnictStaffConnection = {
  __typename?: 'StaffConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictStaffEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictStaff>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictStaffEdge = {
  __typename?: 'StaffEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictStaff>;
};

export type AnnictStaffOrder = {
  direction: AnnictOrderDirection;
  field: AnnictStaffOrderField;
};

export enum AnnictStaffOrderField {
  CreatedAt = 'CREATED_AT',
  SortNumber = 'SORT_NUMBER'
}

export type AnnictStaffResourceItem = AnnictOrganization | AnnictPerson;

export type AnnictStatus = AnnictNode & {
  __typename?: 'Status';
  annictId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  likesCount: Scalars['Int']['output'];
  state: AnnictStatusState;
  user: AnnictUser;
  work: AnnictWork;
};

export enum AnnictStatusState {
  NoState = 'NO_STATE',
  OnHold = 'ON_HOLD',
  StopWatching = 'STOP_WATCHING',
  WannaWatch = 'WANNA_WATCH',
  Watched = 'WATCHED',
  Watching = 'WATCHING'
}

/** Autogenerated input type of UpdateRecord */
export type AnnictUpdateRecordInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  ratingState?: InputMaybe<AnnictRatingState>;
  recordId: Scalars['ID']['input'];
  shareFacebook?: InputMaybe<Scalars['Boolean']['input']>;
  shareTwitter?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Autogenerated return type of UpdateRecord. */
export type AnnictUpdateRecordPayload = {
  __typename?: 'UpdateRecordPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  record?: Maybe<AnnictRecord>;
};

/** Autogenerated input type of UpdateReview */
export type AnnictUpdateReviewInput = {
  body: Scalars['String']['input'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ratingAnimationState: AnnictRatingState;
  ratingCharacterState: AnnictRatingState;
  ratingMusicState: AnnictRatingState;
  ratingOverallState: AnnictRatingState;
  ratingStoryState: AnnictRatingState;
  reviewId: Scalars['ID']['input'];
  shareFacebook?: InputMaybe<Scalars['Boolean']['input']>;
  shareTwitter?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Autogenerated return type of UpdateReview. */
export type AnnictUpdateReviewPayload = {
  __typename?: 'UpdateReviewPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  review?: Maybe<AnnictReview>;
};

/** Autogenerated input type of UpdateStatus */
export type AnnictUpdateStatusInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  state: AnnictStatusState;
  workId: Scalars['ID']['input'];
};

/** Autogenerated return type of UpdateStatus. */
export type AnnictUpdateStatusPayload = {
  __typename?: 'UpdateStatusPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  work?: Maybe<AnnictWork>;
};

export type AnnictUser = AnnictNode & {
  __typename?: 'User';
  activities?: Maybe<AnnictActivityConnection>;
  annictId: Scalars['Int']['output'];
  avatarUrl?: Maybe<Scalars['String']['output']>;
  backgroundImageUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  followers?: Maybe<AnnictUserConnection>;
  followersCount: Scalars['Int']['output'];
  following?: Maybe<AnnictUserConnection>;
  followingActivities?: Maybe<AnnictActivityConnection>;
  followingsCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  libraryEntries?: Maybe<AnnictLibraryEntryConnection>;
  name: Scalars['String']['output'];
  notificationsCount?: Maybe<Scalars['Int']['output']>;
  onHoldCount: Scalars['Int']['output'];
  programs?: Maybe<AnnictProgramConnection>;
  records?: Maybe<AnnictRecordConnection>;
  recordsCount: Scalars['Int']['output'];
  stopWatchingCount: Scalars['Int']['output'];
  url?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
  viewerCanFollow: Scalars['Boolean']['output'];
  viewerIsFollowing: Scalars['Boolean']['output'];
  wannaWatchCount: Scalars['Int']['output'];
  watchedCount: Scalars['Int']['output'];
  watchingCount: Scalars['Int']['output'];
  works?: Maybe<AnnictWorkConnection>;
};


export type AnnictUserActivitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictActivityOrder>;
};


export type AnnictUserFollowersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type AnnictUserFollowingArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type AnnictUserFollowingActivitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictActivityOrder>;
};


export type AnnictUserLibraryEntriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictLibraryEntryOrder>;
  seasonFrom?: InputMaybe<Scalars['String']['input']>;
  seasonUntil?: InputMaybe<Scalars['String']['input']>;
  seasons?: InputMaybe<Array<Scalars['String']['input']>>;
  states?: InputMaybe<Array<AnnictStatusState>>;
};


export type AnnictUserProgramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictProgramOrder>;
  unwatched?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AnnictUserRecordsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hasComment?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictRecordOrder>;
};


export type AnnictUserWorksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  annictIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictWorkOrder>;
  seasons?: InputMaybe<Array<Scalars['String']['input']>>;
  state?: InputMaybe<AnnictStatusState>;
  titles?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** The connection type for User. */
export type AnnictUserConnection = {
  __typename?: 'UserConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictUserEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictUser>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictUserEdge = {
  __typename?: 'UserEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictUser>;
};

/** An anime title */
export type AnnictWork = AnnictNode & {
  __typename?: 'Work';
  annictId: Scalars['Int']['output'];
  casts?: Maybe<AnnictCastConnection>;
  episodes?: Maybe<AnnictEpisodeConnection>;
  episodesCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<AnnictWorkImage>;
  malAnimeId?: Maybe<Scalars['String']['output']>;
  media: AnnictMedia;
  noEpisodes: Scalars['Boolean']['output'];
  officialSiteUrl?: Maybe<Scalars['String']['output']>;
  officialSiteUrlEn?: Maybe<Scalars['String']['output']>;
  programs?: Maybe<AnnictProgramConnection>;
  reviews?: Maybe<AnnictReviewConnection>;
  reviewsCount: Scalars['Int']['output'];
  satisfactionRate?: Maybe<Scalars['Float']['output']>;
  seasonName?: Maybe<AnnictSeasonName>;
  seasonYear?: Maybe<Scalars['Int']['output']>;
  seriesList?: Maybe<AnnictSeriesConnection>;
  staffs?: Maybe<AnnictStaffConnection>;
  syobocalTid?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  titleEn?: Maybe<Scalars['String']['output']>;
  titleKana?: Maybe<Scalars['String']['output']>;
  titleRo?: Maybe<Scalars['String']['output']>;
  twitterHashtag?: Maybe<Scalars['String']['output']>;
  twitterUsername?: Maybe<Scalars['String']['output']>;
  viewerStatusState?: Maybe<AnnictStatusState>;
  watchersCount: Scalars['Int']['output'];
  wikipediaUrl?: Maybe<Scalars['String']['output']>;
  wikipediaUrlEn?: Maybe<Scalars['String']['output']>;
};


/** An anime title */
export type AnnictWorkCastsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictCastOrder>;
};


/** An anime title */
export type AnnictWorkEpisodesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictEpisodeOrder>;
};


/** An anime title */
export type AnnictWorkProgramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictProgramOrder>;
};


/** An anime title */
export type AnnictWorkReviewsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hasBody?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictReviewOrder>;
};


/** An anime title */
export type AnnictWorkSeriesListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


/** An anime title */
export type AnnictWorkStaffsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AnnictStaffOrder>;
};

/** The connection type for Work. */
export type AnnictWorkConnection = {
  __typename?: 'WorkConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AnnictWorkEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<AnnictWork>>>;
  /** Information to aid in pagination. */
  pageInfo: AnnictPageInfo;
};

/** An edge in a connection. */
export type AnnictWorkEdge = {
  __typename?: 'WorkEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<AnnictWork>;
};

export type AnnictWorkImage = AnnictNode & {
  __typename?: 'WorkImage';
  annictId?: Maybe<Scalars['Int']['output']>;
  copyright?: Maybe<Scalars['String']['output']>;
  facebookOgImageUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internalUrl?: Maybe<Scalars['String']['output']>;
  recommendedImageUrl?: Maybe<Scalars['String']['output']>;
  twitterAvatarUrl?: Maybe<Scalars['String']['output']>;
  twitterBiggerAvatarUrl?: Maybe<Scalars['String']['output']>;
  twitterMiniAvatarUrl?: Maybe<Scalars['String']['output']>;
  twitterNormalAvatarUrl?: Maybe<Scalars['String']['output']>;
  work?: Maybe<AnnictWork>;
};


export type AnnictWorkImageInternalUrlArgs = {
  size: Scalars['String']['input'];
};

export type AnnictWorkOrder = {
  direction: AnnictOrderDirection;
  field: AnnictWorkOrderField;
};

export enum AnnictWorkOrderField {
  CreatedAt = 'CREATED_AT',
  Season = 'SEASON',
  WatchersCount = 'WATCHERS_COUNT'
}

export type AnnictSearchWorksQueryVariables = Exact<{
  titles?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type AnnictSearchWorksQuery = { __typename?: 'Query', searchWorks?: { __typename?: 'WorkConnection', nodes?: Array<{ __typename?: 'Work', id: string, title: string, noEpisodes: boolean, episodes?: { __typename?: 'EpisodeConnection', nodes?: Array<{ __typename?: 'Episode', id: string, title?: string | null, number?: number | null, numberText?: string | null } | null> | null } | null, seriesList?: { __typename?: 'SeriesConnection', nodes?: Array<{ __typename?: 'Series', name: string } | null> | null } | null } | null> | null } | null };

export type AnnictViewerActivitiesQueryVariables = Exact<{
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type AnnictViewerActivitiesQuery = { __typename?: 'Query', viewer?: { __typename?: 'User', activities?: { __typename?: 'ActivityConnection', edges?: Array<{ __typename?: 'ActivityEdge', item?:
          | { __typename?: 'MultipleRecord' }
          | { __typename: 'Record', id: string, createdAt: any, work: { __typename?: 'Work', id: string, title: string }, episode: { __typename?: 'Episode', id: string, numberText?: string | null, title?: string | null } }
          | { __typename: 'Review', id: string, createdAt: any, work: { __typename?: 'Work', id: string, title: string } }
          | { __typename?: 'Status' }
         | null } | null> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null } } | null } | null };

export type AnnictCreateRecordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AnnictCreateRecordMutation = { __typename?: 'Mutation', createRecord?: { __typename?: 'CreateRecordPayload', clientMutationId?: string | null } | null };

export type AnnictCreateReviewMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AnnictCreateReviewMutation = { __typename?: 'Mutation', createReview?: { __typename?: 'CreateReviewPayload', clientMutationId?: string | null } | null };

export type AnnictDeleteRecordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AnnictDeleteRecordMutation = { __typename?: 'Mutation', deleteRecord?: { __typename?: 'DeleteRecordPayload', clientMutationId?: string | null } | null };

export type AnnictDeleteReviewMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AnnictDeleteReviewMutation = { __typename?: 'Mutation', deleteReview?: { __typename?: 'DeleteReviewPayload', clientMutationId?: string | null } | null };

export type AnnictFetchNodeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AnnictFetchNodeQuery = { __typename?: 'Query', node?:
    | { __typename: 'Activity' }
    | { __typename: 'Cast' }
    | { __typename: 'Channel' }
    | { __typename: 'ChannelGroup' }
    | { __typename: 'Character' }
    | { __typename: 'Episode', id: string, number?: number | null, numberText?: string | null, episodeTitle?: string | null, work: { __typename?: 'Work', id: string, workTitle: string, seriesList?: { __typename?: 'SeriesConnection', nodes?: Array<{ __typename?: 'Series', name: string } | null> | null } | null } }
    | { __typename: 'LibraryEntry' }
    | { __typename: 'MultipleRecord' }
    | { __typename: 'Organization' }
    | { __typename: 'Person' }
    | { __typename: 'Prefecture' }
    | { __typename: 'Program' }
    | { __typename: 'Record' }
    | { __typename: 'Review' }
    | { __typename: 'Series' }
    | { __typename: 'Staff' }
    | { __typename: 'Status' }
    | { __typename: 'User' }
    | { __typename: 'Work', id: string, noEpisodes: boolean, workTitle: string, episodes?: { __typename?: 'EpisodeConnection', nodes?: Array<{ __typename?: 'Episode', id: string, title?: string | null, number?: number | null, numberText?: string | null } | null> | null } | null, seriesList?: { __typename?: 'SeriesConnection', nodes?: Array<{ __typename?: 'Series', name: string } | null> | null } | null }
    | { __typename: 'WorkImage' }
   | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const SearchWorksDocument = new TypedDocumentString(`
    query searchWorks($titles: [String!]) {
  searchWorks(titles: $titles) {
    nodes {
      id
      title
      noEpisodes
      episodes(orderBy: {field: SORT_NUMBER, direction: ASC}) {
        nodes {
          id
          title
          number
          numberText
        }
      }
      seriesList {
        nodes {
          name
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AnnictSearchWorksQuery, AnnictSearchWorksQueryVariables>;
export const ViewerActivitiesDocument = new TypedDocumentString(`
    query viewerActivities($last: Int, $after: String) {
  viewer {
    activities(
      first: $last
      after: $after
      orderBy: {field: CREATED_AT, direction: DESC}
    ) {
      edges {
        item {
          ... on Review {
            __typename
            id
            createdAt
            work {
              id
              title
            }
          }
          ... on Record {
            __typename
            id
            createdAt
            work {
              id
              title
            }
            episode {
              id
              numberText
              title
            }
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AnnictViewerActivitiesQuery, AnnictViewerActivitiesQueryVariables>;
export const CreateRecordDocument = new TypedDocumentString(`
    mutation createRecord($id: ID!) {
  createRecord(input: {episodeId: $id}) {
    clientMutationId
  }
}
    `) as unknown as TypedDocumentString<AnnictCreateRecordMutation, AnnictCreateRecordMutationVariables>;
export const CreateReviewDocument = new TypedDocumentString(`
    mutation createReview($id: ID!) {
  createReview(input: {workId: $id, body: ""}) {
    clientMutationId
  }
}
    `) as unknown as TypedDocumentString<AnnictCreateReviewMutation, AnnictCreateReviewMutationVariables>;
export const DeleteRecordDocument = new TypedDocumentString(`
    mutation deleteRecord($id: ID!) {
  deleteRecord(input: {recordId: $id}) {
    clientMutationId
  }
}
    `) as unknown as TypedDocumentString<AnnictDeleteRecordMutation, AnnictDeleteRecordMutationVariables>;
export const DeleteReviewDocument = new TypedDocumentString(`
    mutation deleteReview($id: ID!) {
  deleteReview(input: {reviewId: $id}) {
    clientMutationId
  }
}
    `) as unknown as TypedDocumentString<AnnictDeleteReviewMutation, AnnictDeleteReviewMutationVariables>;
export const FetchNodeDocument = new TypedDocumentString(`
    query fetchNode($id: ID!) {
  node(id: $id) {
    __typename
    ... on Episode {
      id
      episodeTitle: title
      number
      numberText
      work {
        id
        workTitle: title
        seriesList {
          nodes {
            name
          }
        }
      }
    }
    ... on Work {
      id
      workTitle: title
      noEpisodes
      episodes(orderBy: {field: SORT_NUMBER, direction: ASC}) {
        nodes {
          id
          title
          number
          numberText
        }
      }
      seriesList {
        nodes {
          name
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AnnictFetchNodeQuery, AnnictFetchNodeQueryVariables>;