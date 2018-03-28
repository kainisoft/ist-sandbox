import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localRu from '@angular/common/locales/ru';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Camera } from '@ionic-native/camera';
import { Firebase } from '@ionic-native/firebase';
import { TranslateParser } from '@ngx-translate/core/src/translate.parser';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import * as ionicGalleryModal from 'ionic-gallery-modal';

import { IstApp } from './app.component';
import { environment } from '../environments/environment';

import { CommentsListComponent } from '../components/comments-list/comments-list';
import { LogoComponent } from '../components/logo/logo';
import { ElementBuilderComponent } from '../components/element-builder/element-builder';
import { LoadingComponent } from '../components/loading/loading';
import { CommentItemComponent } from '../components/comment-item/comment-item';
import { ProfileAvatarComponent } from '../components/profile-avatar/profile-avatar';
import { ProfileHeaderComponent } from '../components/profile-header/profile-header';
import { FeedItemComponent } from '../components/feed-item/feed-item';
import { FeedItemJoinComponent } from '../components/feed-item-join/feed-item-join';
import { ProfileDetailsComponent } from '../components/profile-details/profile-details';
import { PhotoListComponent } from '../components/photo-list/photo-list';
import { StoreItemComponent } from '../components/store-item/store-item';
import { FeedItemGoodsComponent } from '../components/feed-item-goods/feed-item-goods';
import { NoItemsComponent } from '../components/no-items/no-items';
import { MainHeaderComponent } from '../components/main-header/main-header';
import { ContentDrawerComponent } from '../components/content-drawer/content-drawer';
import { PhotoUploaderComponent } from '../components/photo-uploader/photo-uploader';
import { LastReplyComponent } from '../components/last-reply/last-reply';
import { ProfileThumbnailComponent } from '../components/profile-thumbnail/profile-thumbnail';
import { LikeListComponent } from '../components/like-list/like-list';
import { LikeItemComponent } from '../components/like-item/like-item';
import { FeedHeaderComponent } from '../components/feed-header/feed-header';
import { ScreamItemComponent } from '../components/scream-item/scream-item';
import { FeedItemScreamComponent } from '../components/feed-item-scream/feed-item-scream';
import { IdeaItemComponent } from '../components/idea-item/idea-item';
import { FeedItemIdeaComponent } from '../components/feed-item-idea/feed-item-idea';
import { IdeaListComponent } from '../components/idea-list/idea-list';
import { ScreamListComponent } from '../components/scream-list/scream-list';
import { MessageListComponent } from '../components/message-list/message-list';
import { MessageItemComponent } from '../components/message-item/message-item';
import { ConversationListComponent } from '../components/conversation-list/conversation-list';
import { ConversationItemComponent } from '../components/conversation-item/conversation-item';
import { MessageDeliveredStatusComponent } from '../components/message-delivered-status/message-delivered-status';
import { FeedListComponent } from '../components/feed-list/feed-list';
import { SideMenuComponent } from '../components/side-menu/side-menu';

import { TextElementComponent } from '../forms/elements/text/text';
import { EmailElementComponent } from '../forms/elements/email/email';
import { PasswordElementComponent } from '../forms/elements/password/password';
import { DateTimeElementComponent } from '../forms/elements/date-time/date-time';
import { SelectElementComponent } from '../forms/elements/select/select';
import { TextAreaElementComponent } from '../forms/elements/text-area/text-area';
import { NumberElementComponent } from '../forms/elements/number/number';

import { SplashScreenPage } from '../pages/splash-screen/splash-screen';
import { AuthPage } from '../pages/auth/auth';
import { VerifyEmailPage } from '../pages/verify-email/verify-email';
import { CompleteProfilePage } from '../pages/complete-profile/complete-profile';
import { IndexPage } from '../pages/index';
import { FeedPage } from '../pages/feed/feed';
import { SettingsPage } from '../pages/settings/settings';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SettingsProfilePage } from '../pages/settings-profile/settings-profile';
import { SettingsCarPage } from '../pages/settings-car/settings-car';
import { ProfilePage } from '../pages/profile/profile';
import { StorePage } from '../pages/store/store';
import { ManageGoodsPage } from '../pages/manage-goods/manage-goods';
import { LikesPage } from '../pages/likes/likes';
import { PopoverPage } from '../pages/popover/popover';
import { ScreamPage } from '../pages/scream/scream';
import { ManageScreamPage } from '../pages/manage-scream/manage-scream';
import { SettingsPhotoPage } from '../pages/settings-photo/settings-photo';
import { IdeaPage } from '../pages/idea/idea';
import { ManageIdeaPage } from '../pages/manage-idea/manage-idea';
import { ChatPage } from '../pages/chat/chat';
import { ConversationPage } from '../pages/conversation/conversation';
import { NotificationPage } from '../pages/notification/notification';
import { TermsOfUsePage } from '../pages/terms-of-use/terms-of-use';

import { TimeAgoPipe } from '../pipes/time-ago';
import { DisplayNamePipe } from '../pipes/display-name';
import { LocalizedDatePipe } from '../pipes/localized-date';

import { LocalizeService, LocalizeTranslateParser } from '../providers/localize';
import { AuthService } from '../providers/auth';
import { AppService } from '../providers/app';
import { UserService } from '../providers/user';
import { NavigatorService } from '../providers/navigator';
import { CameraProvider } from '../providers/camera.provider';
import { FeedService } from '../providers/feed';
import { StorageService } from '../providers/storage';
import { StoreService } from '../providers/store';
import { PhotoService } from '../providers/photo';
import { CommentService } from '../providers/comment';
import { LikeService } from '../providers/like';
import { ScreamService } from '../providers/scream';
import { IdeaService } from '../providers/idea';
import { ChatService } from '../providers/chat';
import { MessageService } from '../providers/message';
import { NotificationService } from '../providers/notification';
import { LogService } from '../providers/log';
import { CarService } from '../providers/car';
import { StoreListComponent } from '../components/store-list/store-list';
import { Keyboard } from '@ionic-native/keyboard';
import { UserStatusService } from '../providers/user-status';
import { AboutPage } from '../pages/about/about';
import { ReportService } from '../providers/report';

registerLocaleData(localRu, 'ru');

const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

const pages = [
  IstApp,
  SplashScreenPage,
  AuthPage,
  VerifyEmailPage,
  ResetPasswordPage,
  CompleteProfilePage,
  IndexPage,
  FeedPage,
  PopoverPage,
  TermsOfUsePage,
  AboutPage,

  // Messages
  ConversationPage,
  ChatPage,

  // Settings
  SettingsPage,
  SettingsProfilePage,
  SettingsCarPage,
  SettingsPhotoPage,

  // Profile
  ProfilePage,

  // Store
  StorePage,
  ManageGoodsPage,

  // Likes
  LikesPage,

  // Scream
  ScreamPage,
  ManageScreamPage,

  // Idea
  IdeaPage,
  ManageIdeaPage,

  // Notification
  NotificationPage
];

const components = [
  // Common
  LogoComponent,
  LoadingComponent,
  NoItemsComponent,
  MainHeaderComponent,
  ContentDrawerComponent,
  SideMenuComponent,

  // Messages
  ConversationListComponent,
  ConversationItemComponent,
  MessageListComponent,
  MessageItemComponent,
  MessageDeliveredStatusComponent,

  // Photo
  PhotoUploaderComponent,
  PhotoListComponent,

  // Feed
  FeedListComponent,
  FeedItemComponent,
  FeedItemJoinComponent,
  FeedItemGoodsComponent,
  FeedItemScreamComponent,
  FeedItemIdeaComponent,
  FeedHeaderComponent,

  // Form
  ElementBuilderComponent,
  TextElementComponent,
  EmailElementComponent,
  PasswordElementComponent,
  DateTimeElementComponent,
  SelectElementComponent,
  TextAreaElementComponent,
  NumberElementComponent,

  // Comments
  CommentsListComponent,
  CommentItemComponent,
  LastReplyComponent,

  // Likes
  LikeListComponent,
  LikeItemComponent,

  // Profile
  ProfileHeaderComponent,
  ProfileAvatarComponent,
  ProfileThumbnailComponent,
  ProfileDetailsComponent,

  // Store
  StoreItemComponent,
  StoreListComponent,

  // Scream
  ScreamItemComponent,
  ScreamListComponent,

  // Idea
  IdeaItemComponent,
  IdeaListComponent
];

const pipes = [
  TimeAgoPipe,
  DisplayNamePipe,
  LocalizedDatePipe
];

const services = [
  AppService,
  LocalizeService,
  NavigatorService,
  AuthService,
  UserService,
  UserStatusService,
  FeedService,
  StorageService,
  CameraProvider,
  StoreService,
  PhotoService,
  CommentService,
  LikeService,
  ScreamService,
  IdeaService,
  ChatService,
  MessageService,
  NotificationService,
  LogService,
  CarService,
  ReportService
];

@NgModule({
  declarations: [
    pages,
    components,
    pipes
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    IonicModule.forRoot(IstApp, {
      scrollAssist: true,
      autoFocusAssist: true
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      parser: {provide: TranslateParser, useClass: LocalizeTranslateParser},
      useDefaultLang: false,
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ionicGalleryModal.GalleryModalModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    pages,
    components
  ],
  providers: [
    services,

    StatusBar,
    SplashScreen,
    Camera,
    Firebase,
    Keyboard,

    {provide: HAMMER_GESTURE_CONFIG, useClass: ionicGalleryModal.GalleryModalHammerConfig},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
