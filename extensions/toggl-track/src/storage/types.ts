import { Project, Workspace, Client, TimeEntry, Tag, Me } from "../toggl/types";

export type Refreshable<T> = {
  lastRefresh: string | null;
  get: () => Promise<T>;
  refresh: () => Promise<T>;
};

export type TogglStorage = {
  me: Refreshable<Me | null>;
  projects: Refreshable<Project[]>;
  workspaces: Refreshable<Workspace[]>;
  clients: Refreshable<Client[]>;
  tags: Refreshable<Tag[]>;
  runningTimeEntry: Refreshable<TimeEntry | null>;
  timeEntries: Refreshable<TimeEntry[]>;
};

export type Storable<T> = {
  lastRefresh: Date;
  data: T;
};
