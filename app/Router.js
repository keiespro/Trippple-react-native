import { createRouter } from '@exponent/ex-navigation'
import FBAlbumView from './components/FBAlbumView'
import FBPhotoAlbums from './components/FBPhotoAlbums'
import UserProfile from './components/UserProfile'
import FieldModal from './components/modals/FieldModal'
import OnboardModal from './components/modals/OnboardModal'
import FacebookImageSource from './components/screens/FacebookImageSource'
import GenericScreen from './components/screens/Generic'
import WebViewScreen from './components/screens/WebViewScreen'
import Chat from './components/screens/chat/chat'
import Coupling from './components/screens/coupling'
import Matches from './components/screens/matches/matches'
import Potentials from './components/screens/potentials/potentials'
import SettingsBasic from './components/screens/settings/SettingsBasic'
import SettingsCouple from './components/screens/settings/SettingsCouple'
import SettingsDebug from './components/screens/settings/SettingsDebug'
import SettingsPreferences from './components/screens/settings/SettingsPreferences'
import SettingsSettings from './components/screens/settings/SettingsSettings'
import Settings from './components/screens/settings/settings'


export default createRouter(() => ({
  SettingsDebug: () => __DEV__ ? SettingsDebug : false,
  Potentials: () => Potentials,
  Settings: () => Settings,
  SettingsCouple: () => SettingsCouple,
  SettingsBasic: () => SettingsBasic,
  SettingsPreferences: () => SettingsPreferences,
  SettingsSettings: () => SettingsSettings,
  Matches: () => Matches,
  Chat: () => Chat,
  UserProfile: () => UserProfile,
  FacebookImageSource: () => FacebookImageSource,
  WebViewScreen: () => WebViewScreen,
  FieldModal: () => FieldModal,
  FBPhotoAlbums: () => FBPhotoAlbums,
  FBAlbumView: () => FBAlbumView,
  Generic: ()=> GenericScreen,
  Coupling: () => Coupling,
  OnboardModal: () => OnboardModal,
}))
