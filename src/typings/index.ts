declare type url = string

interface IPhoneInfo {
  Phone: string
  VerifyCodeId: string
  VerifyCode: string
}

declare namespace CGI {
  type Role = 'Admin' | 'Member' | 'Owner' | 'SuperAdmin' | 'Editor'
  interface TeamInfo {
    TeamId: string
    Name: string
    MemberCount: number
    Role?: CGI.Role
  }
  interface Entity {
    Type: 'PERSON' | 'TEAM' | 'COOPERATION_SPACE' | ''
    Id: string
  }
  interface MediaAudioStreamItem {
    Bitrate: number
    SamplingRate: number
    Codec: string
  }

  interface MediaVideoStreamItem {
    Bitrate: number
    Height: number
    Width: number
    Codec: string
    Fps: number
  }
  /**
   * 媒体元信息
   */
  interface MediaMetaData {
    Size: number
    Container: string
    Bitrate: number
    Height: number
    Width: number
    Duration: number
    MediaType: keyof AllMedia
    VideoDuration: number
    AudioDuration: number
    Rotate: number
  }
    /**
   * 所有支持的素材类型
   */
  interface AllMedia {
    AUDIO: {
      MetaData: MediaMetaData
      MaterialUrl: string
      CoverUrl: string
      Text?: string
      FileName?: string
    }
  }
  interface VodResult {
    fileId: string
    video: {
      url: string
      verify_content: string
    }
  }
  /* 基础查询参数
   * @param path 路径
   * @param query 查询参数
   * @param res 响应结果
   */
  interface IBaseRequest<query, res> {
    query: query
    res: res
  }
  /**
   * 请求接口
   */
  interface IRequests {
    // 查询账号信息
    'SaaS/Account/DescribeAccount': IBaseRequest<
      {},
      {
        TfUid: string
        AppId: string
        Platform: string
        PlatformId: string
        Nick?: string
        Avatar?: string
        Email?: string
        Phone: string
        Remark?: string
        Role: CGI.Role
        Status: string
      }
    >
    // 获取第三方账号绑定信息
    'SaaS/Account/DescribeThirdPartyIdentity': IBaseRequest<
      {
        IdentityType?: 'WeChat' | 'QQ' | 'Weibo'
      },
      {
        ThirdPartyIdentitySet?: ThirdPartyIdentityInfo[]
      }
    >
    // 登录
    'Login/Login': IBaseRequest<
      {
        LoginType: 'Phone' | 'WeChat' | 'QQ' | 'Weibo' | 'YuFuCo'
        PhoneInfo?: IPhoneInfo
        ThirdPartyLoginInfo?: {
          Code: string
        }
      },
      {
        AppInfoSet?: {
          TfAid: number
          Name: string
        }[]
        Certificate?: string
      }
    >
    // 退出登陆
    'Login/Logout': IBaseRequest<null, null>
    'PaaS/Material/CreateUploadMaterial': IBaseRequest<
      {
        Owner: CGI.Entity
        MaterialType?: keyof CGI.AllMedia | 'EFFECT_VIDEO'
        Name: string
        ClassId?: any
        VerifySign?: string
        TagSet?: string[]
        Attribute?: string
        PreProcessDefinitionSet?: number[] // 洗视频-40
      },
      {
        UploadContext: string
        VodUploadSign: string
      }
    >
    'PaaS/Project/AddMaterialToProject': IBaseRequest<
      {
        ProjectId: string
        MaterialIds: string[]
      },
      {}
    >
    'PaaS/Material/FinishUploadMaterial': IBaseRequest<
      {
        UploadContext: string
        VodFileId: string
        VodVerifyKey: string
      },
      {
        MaterialId: string
      }
    >
  }
  interface ThirdPartyIdentityInfo {
    IdentityType: 'WeChat' | 'QQ' | 'Weibo'
    IdentityId: string
    Nick?: string
    Avatar?: string
  }
}