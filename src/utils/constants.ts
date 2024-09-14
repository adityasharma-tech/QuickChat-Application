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
  
  export const defaultChas: DefaultChatT[] = [];
  export const defaultChats: DefaultChatT[] = [
    {
      id: '123',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Angel Curtis',
      lastChat: 'Please help me find a good monitor for ten laks only.',
      unviewedChats: 2,
    },
    {
      id: '124',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Sophia Lee',
      lastChat: "Let's catch up tomorrow evening!",
      unviewedChats: 0,
    },
    {
      id: '125',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Ethan Brown',
      lastChat: "I've sent the documents you requested.",
      unviewedChats: 5,
    },
    {
      id: '126',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Liam Johnson',
      lastChat: 'Where should we meet for lunch?',
      unviewedChats: 3,
    },
    {
      id: '127',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Olivia Martinez',
      lastChat: 'The project deadline has been extended.',
      unviewedChats: 0,
    },
    {
      id: '128',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Noah Davis',
      lastChat: 'Can you review my code by tomorrow?',
      unviewedChats: 4,
    },
    {
      id: '129',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Emma Wilson',
      lastChat: 'Do you have the latest meeting notes?',
      unviewedChats: 7,
    },
    {
      id: '130',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'James Taylor',
      lastChat: 'Thanks for the help, I owe you one!',
      unviewedChats: 0,
    },
    {
      id: '131',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Mia Anderson',
      lastChat: 'Can we reschedule our call for next week?',
      unviewedChats: 2,
    },
    {
      id: '132',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Alexander White',
      lastChat: 'I’ve booked the tickets for our trip!',
      unviewedChats: 1,
    },
    {
      id: '133',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Charlotte Harris',
      lastChat: 'Let me know when you’re free to discuss the report.',
      unviewedChats: 6,
    },
    {
      id: '134',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Benjamin Clark',
      lastChat: 'I’ll send over the final design tonight.',
      unviewedChats: 0,
    },
    {
      id: '135',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Amelia Lewis',
      lastChat: 'Looking forward to our meeting!',
      unviewedChats: 3,
    },
    {
      id: '136',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Lucas Walker',
      lastChat: 'The client has approved the proposal.',
      unviewedChats: 5,
    },
    {
      id: '137',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Isabella Robinson',
      lastChat: 'Let’s finalize the presentation today.',
      unviewedChats: 8,
    },
    {
      id: '138',
      lastUpdatedAt: new Date(),
      onPress: () => {},
      profileName: 'Henry King',
      lastChat: 'Just submitted the report. Check it out.',
      unviewedChats: 4,
    },
  ];
  
  export const createChatTypes = [
    {
      title: 'New Chat',
      desc: 'Send a message to your contact',
      icon: 'chat-outline',
      screen: 'Contact'
    },
    {
      title: 'New Contact',
      desc: 'Add a contact to be able to send messages',
      icon: 'contacts-outline',
      screen: 'Contact'
    },
    {
      title: 'New Community',
      desc: 'Join the community around you',
      icon: 'account-multiple-outline',
      screen: 'Contact'
    },
  ];
  