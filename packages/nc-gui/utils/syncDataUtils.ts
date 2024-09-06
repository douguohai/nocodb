import type { CSSProperties, FunctionalComponent, SVGAttributes } from 'nuxt/dist/app/compat/capi'
import { ClientType, IntegrationCategoryType, SyncDataType } from '~/lib/enums'

export interface IntegrationItemType {
  title: string
  icon: FunctionalComponent<SVGAttributes, {}, any, {}>
  value: SyncDataType | ClientType
  categories: IntegrationCategoryType[]
  isAvailable?: boolean
  iconStyle?: CSSProperties
  isOssOnly?: boolean
  subtitle?: string
}

export interface IntegrationCategoryItemType {
  title: string
  subtitle: string
  value: IntegrationCategoryType
  isAvailable?: boolean
  teleEventName?: IntegrationCategoryType
}

export const integrationCategories: IntegrationCategoryItemType[] = [
  {
    title: 'labels.database',
    subtitle: 'objects.integrationCategories.databaseSubtitle',
    value: IntegrationCategoryType.DATABASE,
    isAvailable: true,
  },
  {
    title: 'objects.integrationCategories.ai',
    subtitle: 'objects.integrationCategories.ai',
    value: IntegrationCategoryType.AI,
  },
  {
    title: 'objects.integrationCategories.communication',
    subtitle: 'objects.integrationCategories.communicationSubtitle',
    value: IntegrationCategoryType.COMMUNICATION,
  },
  {
    title: 'objects.integrationCategories.spreadSheet',
    subtitle: 'objects.integrationCategories.spreadSheetSubtitle',
    value: IntegrationCategoryType.SPREAD_SHEET,
    teleEventName: IntegrationCategoryType.OTHERS,
  },
  {
    title: 'objects.integrationCategories.projectManagement',
    subtitle: 'objects.integrationCategories.projectManagementSubtitle',
    value: IntegrationCategoryType.PROJECT_MANAGEMENT,
  },
  {
    title: 'objects.integrationCategories.ticketing',
    subtitle: 'objects.integrationCategories.ticketingSubtitle',
    value: IntegrationCategoryType.TICKETING,
  },
  {
    title: 'objects.integrationCategories.crm',
    subtitle: 'objects.integrationCategories.crmSubtitle',
    value: IntegrationCategoryType.CRM,
  },
  {
    title: 'objects.integrationCategories.marketing',
    subtitle: 'objects.integrationCategories.marketingSubtitle',
    value: IntegrationCategoryType.MARKETING,
  },
  {
    title: 'objects.integrationCategories.ats',
    subtitle: 'objects.integrationCategories.atsSubtitle',
    value: IntegrationCategoryType.ATS,
  },
  {
    title: 'objects.integrationCategories.development',
    subtitle: 'objects.integrationCategories.developmentSubtitle',
    value: IntegrationCategoryType.DEVELOPMENT,
  },
  {
    title: 'objects.integrationCategories.finance',
    subtitle: 'objects.integrationCategories.financeSubtitle',
    value: IntegrationCategoryType.FINANCE,
  },
  {
    title: 'labels.storage',
    subtitle: 'objects.integrationCategories.storageSubtitle',
    value: IntegrationCategoryType.STORAGE,
  },
  {
    title: 'objects.integrationCategories.others',
    subtitle: 'objects.integrationCategories.othersSubtitle',
    value: IntegrationCategoryType.OTHERS,
  },
]

export const allIntegrations: IntegrationItemType[] = [
  // Database
  {
    title: 'objects.syncData.mysql',
    value: ClientType.MYSQL,
    icon: iconMap.mysql,
    categories: [IntegrationCategoryType.DATABASE],
    isAvailable: true,
    iconStyle: {
      width: '32px',
      height: '32px',
    },
  },
  {
    title: 'objects.syncData.postgreSQL',
    value: ClientType.PG,
    icon: iconMap.postgreSql,
    categories: [IntegrationCategoryType.DATABASE],
    isAvailable: true,
  },
  {
    title: 'objects.syncData.sqlite',
    value: ClientType.SQLITE,
    icon: iconMap.sqlServer,
    categories: [IntegrationCategoryType.DATABASE],
    isAvailable: true,
    isOssOnly: true,
  },
  {
    title: 'objects.syncData.snowflake',
    value: ClientType.SNOWFLAKE,
    icon: iconMap.snowflake,
    categories: [IntegrationCategoryType.DATABASE],
  },
  {
    title: 'objects.syncData.dataBricks',
    value: ClientType.DATABRICKS,
    icon: iconMap.dataBricks,
    categories: [IntegrationCategoryType.DATABASE],
  },
  {
    title: 'objects.syncData.mssqlServer',
    value: ClientType.MSSQL,
    icon: iconMap.mssqlServer,
    categories: [IntegrationCategoryType.DATABASE],
  },
  {
    title: 'objects.syncData.oracle',
    value: SyncDataType.ORACLE,
    icon: iconMap.oracle,
    categories: [IntegrationCategoryType.DATABASE],
  },

  // AI

  // Communication

  // Project Management

  // CRM


  // Marketing

  // ATS


  // Development


  // Finance


  // Ticketing


  // Storage


  // Spreadsheet

  // Others
  // {
  //   title: 'objects.syncData.googleCalendar',
  //   value: SyncDataType.GOOGLE_CALENDAR,
  //   icon: iconMap.googleCalendar,
  //   categories: [IntegrationCategoryType.OTHERS],
  // },
]

export const allIntegrationsMapByValue = allIntegrations.reduce((acc, curr) => {
  acc[curr.value] = curr
  return acc
}, {} as Record<string, IntegrationItemType>)
