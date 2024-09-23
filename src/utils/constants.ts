import { GestureResponderEvent } from 'react-native';
import {v4 as uuidv4} from 'uuid';

export const envs : {
    server_url: string;
    widget_id: string;
    widget_auth_token: string;
} = {
  server_url: "" || process.env.SERVER_URL!,
  widget_id: process.env.MSG91_WIDGET_ID!,
  widget_auth_token: process.env.MSG91_TOKEN_AUTH!
}

export interface DefaultChatT {
  id: string;
  profileName: string;
  lastChat?: string;
  lastUpdatedAt: Date;
  onPress: any;
  profilePhoto?: string;
  unviewedChats?: number;
}

export interface DefaultStatusT {
  profileName: string;
  phoneNumber: string;
}

export interface DefaultContactT {
  contactName: string;
  phoneNumber: string;
}

interface DefaultTabsT {
  id: TabNameE;
  label: string;
}

export enum TabNameE {
  ALL = 'all',
  OFFICE = 'office',
  FAMILY = 'family',
  ARCHIVE = 'archive',
}

export const defaultTabs: DefaultTabsT[] = [
  {
    id: TabNameE.ALL,
    label: 'All',
  },
  {
    id: TabNameE.OFFICE,
    label: 'Office',
  },
  {
    id: TabNameE.FAMILY,
    label: 'Family',
  },
  {
    id: TabNameE.ARCHIVE,
    label: 'Archive',
  },
];

export const defaultContacts: DefaultContactT[] = [
  {
    contactName: 'Unknown',
    phoneNumber: '+911234567890',
  },
];

export const defaultStatus: DefaultStatusT[] = [
  {
    phoneNumber: '12312312231',
    profileName: 'Terry',
  },
  {
    phoneNumber: '12324545231',
    profileName: 'Craig',
  },
  {
    phoneNumber: '23443321231',
    profileName: 'Roger',
  },
  {
    phoneNumber: '23423423423',
    profileName: 'Nolan',
  },
  {
    phoneNumber: '23443231231',
    profileName: 'Peper',
  },
];


export const createChatTypes = [
  {
    title: 'New Chat',
    desc: 'Send a message to your contact',
    icon: 'chat-outline',
    screen: 'Contact',
  },
  {
    title: 'New Contact',
    desc: 'Add a contact to be able to send messages',
    icon: 'contacts-outline',
    screen: 'Contact',
  },
  {
    title: 'New Community',
    desc: 'Join the community around you',
    icon: 'account-multiple-outline',
    screen: 'Contact',
  },
];


export const reactIcons: string[] = [
  '🔥', '😁', '🤣', '👌', '👍', '❤️',
];

type SpecificChatReplyOptionsT = {
  optionName: string;
  optionIcon: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}
export const specificChatReplyOptions: SpecificChatReplyOptionsT[] = [
  {
    optionName: 'Copy',
    optionIcon: 'clipboard-outline',
  },
  {
    optionName: 'Reply',
    optionIcon: 'arrow-down-left',
  },
  {
    optionName: 'Forward',
    optionIcon: 'arrow-down-right',
  },
  {
    optionName: 'Delete',
    optionIcon: 'trash-can-outline',
  },
];

type ProfileStatusListT = {
  backgroundImage: string;
  label: string;
  id: string;
}

export const profileStoryList: ProfileStatusListT[] = [
  {
    backgroundImage: 'https://picsum.photos/200/300?uid=1',
    label: 'Cakep banget ini taneman, cocok bgt',
    id: uuidv4(),
  },
  {
    backgroundImage: 'https://picsum.photos/200/300?uid=2',
    label: 'Kursi aja berdua, kamu masa sendiri',
    id: uuidv4(),
  },
  {
    backgroundImage: 'https://picsum.photos/200/300?uid=3',
    label: 'Ngopi dulul, lorem ipsum, sebelum',
    id: uuidv4(),
  },
  {
    backgroundImage: 'https://picsum.photos/200/300?uid=4',
    label: 'Cakep banget ini taneman, cocok bgt',
    id: uuidv4(),
  },
];
