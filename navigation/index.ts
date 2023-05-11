export type SettingsStackParamList = {
  SettingsScreen: undefined;
};

export type AreaStackParamList = {
  SpatialAreaSelectScreen: undefined;
  SelectFromListScreen: {
    list: number[];
    selectedIndex: number;
    onPress: (selection: number) => void;
  };
};

export type ContextStackParamList = {
  ContextListScreen: undefined;
  ContextDetailScreen: undefined;
};

export type FindsStackParamList = {
  FindsBagPhotosScreen: undefined;
};

export type MainTabParamList = {
  AreaNavigator: undefined;
  ContextNavigator: undefined;
  FindsNavigator: undefined;
  SettingsNavigator: undefined;
  Login: undefined;
};
