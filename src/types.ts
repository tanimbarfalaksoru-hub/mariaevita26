export interface Profile {
  logoText?: string;
  name?: string;
  role?: string;
  heroText?: string;
  bio?: string;
  visi?: string;
  misi?: string;
  photoUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  desc: string;
}

export interface Project {
  id: string;
  title: string;
  image: string;
  desc: string;
  link?: string;
}

export interface Article {
  id: string;
  title: string;
  image: string;
  content: string;
}

export interface Gallery {
  id: string;
  title: string;
  image: string;
  desc: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface AppState {
  profile: Profile;
  subjects: Subject[];
  projects: Project[];
  articles: Article[];
  galleries: Gallery[];
  messages: Message[];
}
