module.exports = {
    "nested": {
      "easemob": {
        "nested": {
          "pb": {
            "nested": {
              "MessageBody": {
                "fields": {
                  "type": {
                    "type": "Type",
                    "id": 1
                  },
                  "from": {
                    "type": "JID",
                    "id": 2
                  },
                  "to": {
                    "type": "JID",
                    "id": 3
                  },
                  "contents": {
                    "rule": "repeated",
                    "type": "Content",
                    "id": 4
                  },
                  "ext": {
                    "rule": "repeated",
                    "type": "KeyValue",
                    "id": 5
                  },
                  "ackMessageId": {
                    "type": "uint64",
                    "id": 6
                  },
                  "msgConfig": {
                    "type": "MessageConfig",
                    "id": 7
                  },
                  "ackContent": {
                    "type": "string",
                    "id": 8
                  }
                },
                "nested": {
                  "Content": {
                    "fields": {
                      "type": {
                        "type": "Type",
                        "id": 1
                      },
                      "text": {
                        "type": "string",
                        "id": 2
                      },
                      "latitude": {
                        "type": "double",
                        "id": 3
                      },
                      "longitude": {
                        "type": "double",
                        "id": 4
                      },
                      "address": {
                        "type": "string",
                        "id": 5
                      },
                      "displayName": {
                        "type": "string",
                        "id": 6
                      },
                      "remotePath": {
                        "type": "string",
                        "id": 7
                      },
                      "secretKey": {
                        "type": "string",
                        "id": 8
                      },
                      "fileLength": {
                        "type": "int32",
                        "id": 9
                      },
                      "action": {
                        "type": "string",
                        "id": 10
                      },
                      "params": {
                        "rule": "repeated",
                        "type": "KeyValue",
                        "id": 11
                      },
                      "duration": {
                        "type": "int32",
                        "id": 12
                      },
                      "size": {
                        "type": "Size",
                        "id": 13
                      },
                      "thumbnailRemotePath": {
                        "type": "string",
                        "id": 14
                      },
                      "thumbnailSecretKey": {
                        "type": "string",
                        "id": 15
                      },
                      "thumbnailDisplayName": {
                        "type": "string",
                        "id": 16
                      },
                      "thumbnailFileLength": {
                        "type": "int32",
                        "id": 17
                      },
                      "thumbnailSize": {
                        "type": "Size",
                        "id": 18
                      }
                    },
                    "nested": {
                      "Type": {
                        "values": {
                          "TEXT": 0,
                          "IMAGE": 1,
                          "VIDEO": 2,
                          "LOCATION": 3,
                          "VOICE": 4,
                          "FILE": 5,
                          "COMMAND": 6
                        }
                      },
                      "Size": {
                        "fields": {
                          "width": {
                            "type": "double",
                            "id": 1
                          },
                          "height": {
                            "type": "double",
                            "id": 2
                          }
                        }
                      }
                    }
                  },
                  "Type": {
                    "values": {
                      "NORMAL": 0,
                      "CHAT": 1,
                      "GROUPCHAT": 2,
                      "CHATROOM": 3,
                      "READ_ACK": 4,
                      "DELIVER_ACK": 5,
                      "RECALL": 6
                    }
                  },
                  "MessageConfig": {
                    "fields": {
                      "allowGroupAck": {
                        "type": "bool",
                        "id": 1
                      }
                    }
                  }
                }
              },
              "KeyValue": {
                "oneofs": {
                  "value": {
                    "oneof": [
                      "varintValue",
                      "floatValue",
                      "doubleValue",
                      "stringValue"
                    ]
                  }
                },
                "fields": {
                  "key": {
                    "type": "string",
                    "id": 1
                  },
                  "type": {
                    "type": "ValueType",
                    "id": 2
                  },
                  "varintValue": {
                    "type": "int64",
                    "id": 3
                  },
                  "floatValue": {
                    "type": "float",
                    "id": 4
                  },
                  "doubleValue": {
                    "type": "double",
                    "id": 5
                  },
                  "stringValue": {
                    "type": "string",
                    "id": 6
                  }
                },
                "nested": {
                  "ValueType": {
                    "values": {
                      "BOOL": 1,
                      "INT": 2,
                      "UINT": 3,
                      "LLINT": 4,
                      "FLOAT": 5,
                      "DOUBLE": 6,
                      "STRING": 7,
                      "JSON_STRING": 8
                    }
                  }
                }
              },
              "JID": {
                "fields": {
                  "appKey": {
                    "type": "string",
                    "id": 1
                  },
                  "name": {
                    "type": "string",
                    "id": 2
                  },
                  "domain": {
                    "type": "string",
                    "id": 3
                  },
                  "clientResource": {
                    "type": "string",
                    "id": 4
                  }
                }
              },
              "ConferenceBody": {
                "fields": {
                  "sessionId": {
                    "type": "string",
                    "id": 1
                  },
                  "operation": {
                    "type": "Operation",
                    "id": 2
                  },
                  "conferenceId": {
                    "type": "string",
                    "id": 3
                  },
                  "type": {
                    "type": "Type",
                    "id": 4
                  },
                  "content": {
                    "type": "string",
                    "id": 5
                  },
                  "network": {
                    "type": "string",
                    "id": 6
                  },
                  "version": {
                    "type": "string",
                    "id": 7
                  },
                  "identity": {
                    "type": "Identity",
                    "id": 8
                  },
                  "duration": {
                    "type": "string",
                    "id": 9
                  },
                  "peerName": {
                    "type": "string",
                    "id": 10
                  },
                  "endReason": {
                    "type": "EndReason",
                    "id": 11
                  },
                  "status": {
                    "type": "Status",
                    "id": 12
                  },
                  "isDirect": {
                    "type": "bool",
                    "id": 13
                  },
                  "controlType": {
                    "type": "StreamControlType",
                    "id": 14
                  },
                  "routeFlag": {
                    "type": "int32",
                    "id": 15
                  },
                  "routeKey": {
                    "type": "string",
                    "id": 16
                  }
                },
                "nested": {
                  "Status": {
                    "fields": {
                      "errorCode": {
                        "type": "int32",
                        "id": 1
                      }
                    }
                  },
                  "Operation": {
                    "values": {
                      "JOIN": 0,
                      "INITIATE": 1,
                      "ACCEPT_INITIATE": 2,
                      "ANSWER": 3,
                      "TERMINATE": 4,
                      "REMOVE": 5,
                      "STREAM_CONTROL": 6,
                      "MEDIA_REQUEST": 7
                    }
                  },
                  "Type": {
                    "values": {
                      "VOICE": 0,
                      "VIDEO": 1
                    }
                  },
                  "Identity": {
                    "values": {
                      "CALLER": 0,
                      "CALLEE": 1
                    }
                  },
                  "EndReason": {
                    "values": {
                      "HANGUP": 0,
                      "NORESPONSE": 1,
                      "REJECT": 2,
                      "BUSY": 3,
                      "FAIL": 4,
                      "UNSUPPORTED": 5,
                      "OFFLINE": 6
                    }
                  },
                  "StreamControlType": {
                    "values": {
                      "PAUSE_VOICE": 0,
                      "RESUME_VOICE": 1,
                      "PAUSE_VIDEO": 2,
                      "RESUME_VIDEO": 3
                    }
                  }
                }
              },
              "MSync": {
                "fields": {
                  "version": {
                    "type": "Version",
                    "id": 1,
                    "options": {
                      "default": "MSYNC_V1"
                    }
                  },
                  "guid": {
                    "type": "JID",
                    "id": 2
                  },
                  "auth": {
                    "type": "string",
                    "id": 3
                  },
                  "compressAlgorimth": {
                    "type": "uint32",
                    "id": 4
                  },
                  "crypto": {
                    "type": "uint32",
                    "id": 5
                  },
                  "userAgent": {
                    "type": "string",
                    "id": 6
                  },
                  "pov": {
                    "type": "uint64",
                    "id": 7
                  },
                  "command": {
                    "type": "Command",
                    "id": 8
                  },
                  "deviceId": {
                    "type": "uint32",
                    "id": 10
                  },
                  "encryptType": {
                    "rule": "repeated",
                    "type": "EncryptType",
                    "id": 11,
                    "options": {
                      "packed": false
                    }
                  },
                  "encryptKey": {
                    "type": "string",
                    "id": 12
                  },
                  "payload": {
                    "type": "bytes",
                    "id": 9
                  }
                },
                "nested": {
                  "Version": {
                    "values": {
                      "MSYNC_V1": 0,
                      "MSYNC_V2": 1
                    }
                  },
                  "Command": {
                    "values": {
                      "SYNC": 0,
                      "UNREAD": 1,
                      "NOTICE": 2,
                      "PROVISION": 3
                    }
                  }
                }
              },
              "EncryptType": {
                "values": {
                  "ENCRYPT_NONE": 0,
                  "ENCRYPT_AES_128_CBC": 1,
                  "ENCRYPT_AES_256_CBC": 2
                }
              },
              "CommSyncUL": {
                "fields": {
                  "meta": {
                    "type": "Meta",
                    "id": 1
                  },
                  "key": {
                    "type": "uint64",
                    "id": 2
                  },
                  "queue": {
                    "type": "JID",
                    "id": 3
                  },
                  "isRoam": {
                    "type": "bool",
                    "id": 4
                  },
                  "lastFullRoamKey": {
                    "type": "uint64",
                    "id": 5
                  }
                }
              },
              "CommSyncDL": {
                "fields": {
                  "status": {
                    "type": "Status",
                    "id": 1
                  },
                  "metaId": {
                    "type": "uint64",
                    "id": 2
                  },
                  "serverId": {
                    "type": "uint64",
                    "id": 3
                  },
                  "metas": {
                    "rule": "repeated",
                    "type": "Meta",
                    "id": 4
                  },
                  "nextKey": {
                    "type": "uint64",
                    "id": 5
                  },
                  "queue": {
                    "type": "JID",
                    "id": 6
                  },
                  "isLast": {
                    "type": "bool",
                    "id": 7
                  },
                  "timestamp": {
                    "type": "uint64",
                    "id": 8
                  },
                  "isRoam": {
                    "type": "bool",
                    "id": 9
                  }
                }
              },
              "CommNotice": {
                "fields": {
                  "queue": {
                    "type": "JID",
                    "id": 1
                  }
                }
              },
              "CommUnreadUL": {
                "fields": {}
              },
              "CommUnreadDL": {
                "fields": {
                  "status": {
                    "type": "Status",
                    "id": 1
                  },
                  "unread": {
                    "rule": "repeated",
                    "type": "MetaQueue",
                    "id": 2
                  },
                  "timestamp": {
                    "type": "uint64",
                    "id": 3
                  }
                }
              },
              "MetaQueue": {
                "fields": {
                  "queue": {
                    "type": "JID",
                    "id": 1
                  },
                  "n": {
                    "type": "uint32",
                    "id": 2
                  }
                }
              },
              "Meta": {
                "fields": {
                  "id": {
                    "type": "uint64",
                    "id": 1
                  },
                  "from": {
                    "type": "JID",
                    "id": 2
                  },
                  "to": {
                    "type": "JID",
                    "id": 3
                  },
                  "timestamp": {
                    "type": "uint64",
                    "id": 4
                  },
                  "ns": {
                    "type": "NameSpace",
                    "id": 5
                  },
                  "payload": {
                    "type": "bytes",
                    "id": 6
                  },
                  "routetype": {
                    "type": "RouteType",
                    "id": 7
                  }
                },
                "nested": {
                  "NameSpace": {
                    "values": {
                      "STATISTIC": 0,
                      "CHAT": 1,
                      "MUC": 2,
                      "ROSTER": 3,
                      "CONFERENCE": 4
                    }
                  },
                  "RouteType": {
                    "values": {
                      "ROUTE_ALL": 0,
                      "ROUTE_ONLINE": 1
                    }
                  }
                }
              },
              "Status": {
                "fields": {
                  "errorCode": {
                    "type": "ErrorCode",
                    "id": 1
                  },
                  "reason": {
                    "type": "string",
                    "id": 2
                  },
                  "redirectInfo": {
                    "rule": "repeated",
                    "type": "RedirectInfo",
                    "id": 3
                  }
                },
                "nested": {
                  "ErrorCode": {
                    "values": {
                      "OK": 0,
                      "FAIL": 1,
                      "UNAUTHORIZED": 2,
                      "MISSING_PARAMETER": 3,
                      "WRONG_PARAMETER": 4,
                      "REDIRECT": 5,
                      "TOKEN_EXPIRED": 6,
                      "PERMISSION_DENIED": 7,
                      "NO_ROUTE": 8,
                      "UNKNOWN_COMMAND": 9,
                      "PB_PARSER_ERROR": 10,
                      "BIND_ANOTHER_DEVICE": 11,
                      "IM_FORBIDDEN": 12,
                      "TOO_MANY_DEVICES": 13,
                      "PLATFORM_LIMIT": 14,
                      "USER_MUTED": 15,
                      "ENCRYPT_DISABLE": 16,
                      "ENCRYPT_ENABLE": 17,
                      "DECRYPT_FAILURE": 18
                    }
                  }
                }
              },
              "RedirectInfo": {
                "fields": {
                  "host": {
                    "type": "string",
                    "id": 1
                  },
                  "port": {
                    "type": "uint32",
                    "id": 2
                  }
                }
              },
              "Provision": {
                "fields": {
                  "osType": {
                    "type": "OsType",
                    "id": 1
                  },
                  "version": {
                    "type": "string",
                    "id": 2
                  },
                  "networkType": {
                    "type": "NetworkType",
                    "id": 3
                  },
                  "appSign": {
                    "type": "string",
                    "id": 4
                  },
                  "compressType": {
                    "rule": "repeated",
                    "type": "CompressType",
                    "id": 5,
                    "options": {
                      "packed": false
                    }
                  },
                  "encryptType": {
                    "rule": "repeated",
                    "type": "EncryptType",
                    "id": 6,
                    "options": {
                      "packed": false
                    }
                  },
                  "encryptKey": {
                    "type": "string",
                    "id": 7
                  },
                  "status": {
                    "type": "Status",
                    "id": 8
                  },
                  "deviceUuid": {
                    "type": "string",
                    "id": 9
                  },
                  "isManualLogin": {
                    "type": "bool",
                    "id": 10
                  },
                  "password": {
                    "type": "string",
                    "id": 11
                  },
                  "deviceName": {
                    "type": "string",
                    "id": 12
                  },
                  "resource": {
                    "type": "string",
                    "id": 13
                  },
                  "auth": {
                    "type": "string",
                    "id": 14
                  }
                },
                "nested": {
                  "OsType": {
                    "values": {
                      "OS_IOS": 0,
                      "OS_ANDROID": 1,
                      "OS_LINUX": 2,
                      "OS_OSX": 3,
                      "OS_WIN": 4,
                      "OS_OTHER": 16
                    }
                  },
                  "NetworkType": {
                    "values": {
                      "NETWORK_NONE": 0,
                      "NETWORK_WIFI": 1,
                      "NETWORK_4G": 2,
                      "NETWORK_3G": 3,
                      "NETWORK_2G": 4,
                      "NETWORK_WIRE": 5
                    }
                  },
                  "CompressType": {
                    "values": {
                      "COMPRESS_NONE": 0,
                      "COMPRESS_ZLIB": 1
                    }
                  }
                }
              },
              "MUCBody": {
                "fields": {
                  "mucId": {
                    "type": "JID",
                    "id": 1
                  },
                  "operation": {
                    "type": "Operation",
                    "id": 2
                  },
                  "from": {
                    "type": "JID",
                    "id": 3
                  },
                  "to": {
                    "rule": "repeated",
                    "type": "JID",
                    "id": 4
                  },
                  "setting": {
                    "type": "Setting",
                    "id": 5
                  },
                  "reason": {
                    "type": "string",
                    "id": 6
                  },
                  "isChatroom": {
                    "type": "bool",
                    "id": 7
                  },
                  "status": {
                    "type": "Status",
                    "id": 8
                  }
                },
                "nested": {
                  "Operation": {
                    "values": {
                      "CREATE": 0,
                      "DESTROY": 1,
                      "JOIN": 2,
                      "LEAVE": 3,
                      "APPLY": 4,
                      "APPLY_ACCEPT": 5,
                      "APPLY_DECLINE": 6,
                      "INVITE": 7,
                      "INVITE_ACCEPT": 8,
                      "INVITE_DECLINE": 9,
                      "KICK": 10,
                      "GET_BLACKLIST": 11,
                      "BAN": 12,
                      "ALLOW": 13,
                      "UPDATE": 14,
                      "BLOCK": 15,
                      "UNBLOCK": 16,
                      "PRESENCE": 17,
                      "ABSENCE": 18,
                      "DIRECT_JOINED": 19,
                      "ASSIGN_OWNER": 20,
                      "ADD_ADMIN": 21,
                      "REMOVE_ADMIN": 22,
                      "ADD_MUTE": 23,
                      "REMOVE_MUTE": 24,
                      "UPDATE_ANNOUNCEMENT": 25,
                      "DELETE_ANNOUNCEMENT": 26,
                      "UPLOAD_FILE": 27,
                      "DELETE_FILE": 28
                    }
                  },
                  "Setting": {
                    "fields": {
                      "name": {
                        "type": "string",
                        "id": 1
                      },
                      "desc": {
                        "type": "string",
                        "id": 2
                      },
                      "type": {
                        "type": "Type",
                        "id": 3
                      },
                      "maxUsers": {
                        "type": "int32",
                        "id": 4
                      },
                      "owner": {
                        "type": "string",
                        "id": 5
                      }
                    },
                    "nested": {
                      "Type": {
                        "values": {
                          "PRIVATE_OWNER_INVITE": 0,
                          "PRIVATE_MEMBER_INVITE": 1,
                          "PUBLIC_JOIN_APPROVAL": 2,
                          "PUBLIC_JOIN_OPEN": 3,
                          "PUBLIC_ANONYMOUS": 4
                        }
                      }
                    }
                  },
                  "Status": {
                    "fields": {
                      "errorCode": {
                        "type": "ErrorCode",
                        "id": 1
                      },
                      "description": {
                        "type": "string",
                        "id": 2
                      }
                    },
                    "nested": {
                      "ErrorCode": {
                        "values": {
                          "OK": 0,
                          "PERMISSION_DENIED": 1,
                          "WRONG_PARAMETER": 2,
                          "MUC_NOT_EXIST": 3,
                          "USER_NOT_EXIST": 4,
                          "UNKNOWN": 5
                        }
                      }
                    }
                  }
                }
              },
              "RosterBody": {
                "fields": {
                  "operation": {
                    "type": "Operation",
                    "id": 1
                  },
                  "status": {
                    "type": "Status",
                    "id": 2
                  },
                  "from": {
                    "type": "JID",
                    "id": 3
                  },
                  "to": {
                    "rule": "repeated",
                    "type": "JID",
                    "id": 4
                  },
                  "reason": {
                    "type": "string",
                    "id": 5
                  },
                  "rosterVer": {
                    "type": "string",
                    "id": 6
                  },
                  "biDirection": {
                    "type": "bool",
                    "id": 7
                  }
                },
                "nested": {
                  "Operation": {
                    "values": {
                      "GET_ROSTER": 0,
                      "GET_BLACKLIST": 1,
                      "ADD": 2,
                      "REMOVE": 3,
                      "ACCEPT": 4,
                      "DECLINE": 5,
                      "BAN": 6,
                      "ALLOW": 7,
                      "REMOTE_ACCEPT": 8,
                      "REMOTE_DECLINE": 9
                    }
                  },
                  "Status": {
                    "fields": {
                      "errorCode": {
                        "type": "ErrorCode",
                        "id": 1
                      },
                      "description": {
                        "type": "string",
                        "id": 2
                      }
                    },
                    "nested": {
                      "ErrorCode": {
                        "values": {
                          "OK": 0,
                          "USER_NOT_EXIST": 1,
                          "USER_ALREADY_FRIEND": 2,
                          "USER_ALREADY_BLACKLIST": 3
                        }
                      }
                    }
                  }
                }
              },
              "StatisticsBody": {
                "fields": {
                  "operation": {
                    "type": "Operation",
                    "id": 1
                  },
                  "os": {
                    "type": "OsType",
                    "id": 2
                  },
                  "version": {
                    "type": "string",
                    "id": 3
                  },
                  "network": {
                    "type": "NetworkType",
                    "id": 4
                  },
                  "imTime": {
                    "type": "uint32",
                    "id": 5
                  },
                  "chatTime": {
                    "type": "uint32",
                    "id": 6
                  },
                  "location": {
                    "type": "string",
                    "id": 7
                  }
                },
                "nested": {
                  "Operation": {
                    "values": {
                      "INFORMATION": 0,
                      "USER_REMOVED": 1,
                      "USER_LOGIN_ANOTHER_DEVICE": 2,
                      "USER_KICKED_BY_CHANGE_PASSWORD": 3,
                      "USER_KICKED_BY_OTHER_DEVICE": 4
                    }
                  },
                  "OsType": {
                    "values": {
                      "OS_IOS": 0,
                      "OS_ANDROID": 1,
                      "OS_LINUX": 2,
                      "OS_OSX": 3,
                      "OS_WIN": 4,
                      "OS_OTHER": 16
                    }
                  },
                  "NetworkType": {
                    "values": {
                      "NETWORK_NONE": 0,
                      "NETWORK_WIFI": 1,
                      "NETWORK_4G": 2,
                      "NETWORK_3G": 3,
                      "NETWORK_2G": 4,
                      "NETWORK_WIRE": 5
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
}
