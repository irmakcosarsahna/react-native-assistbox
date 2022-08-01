/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import <Foundation/Foundation.h>
#import "ASTAvailability.h"

typedef enum {
    ASTCommandStatus_NO_RESULT = 0,
    ASTCommandStatus_OK,
    ASTCommandStatus_CLASS_NOT_FOUND_EXCEPTION,
    ASTCommandStatus_ILLEGAL_ACCESS_EXCEPTION,
    ASTCommandStatus_INSTANTIATION_EXCEPTION,
    ASTCommandStatus_MALFORMED_URL_EXCEPTION,
    ASTCommandStatus_IO_EXCEPTION,
    ASTCommandStatus_INVALID_ACTION,
    ASTCommandStatus_JSON_EXCEPTION,
    ASTCommandStatus_ERROR
} ASTCommandStatus;

@interface ASTPluginResult : NSObject {}

@property (nonatomic, strong, readonly) NSNumber* status;
@property (nonatomic, strong, readonly) id message;
@property (nonatomic, strong)           NSNumber* keepCallback;
// This property can be used to scope the lifetime of another object. For example,
// Use it to store the associated NSData when `message` is created using initWithBytesNoCopy.
@property (nonatomic, strong) id associatedObject;

- (ASTPluginResult*)init;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageAsString:(NSString*)theMessage;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageAsArray:(NSArray*)theMessage;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageAsInt:(int)theMessage;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageAsNSInteger:(NSInteger)theMessage;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageAsNSUInteger:(NSUInteger)theMessage;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageAsDouble:(double)theMessage;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageAsBool:(BOOL)theMessage;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageAsDictionary:(NSDictionary*)theMessage;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageAsArrayBuffer:(NSData*)theMessage;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageAsMultipart:(NSArray*)theMessages;
+ (ASTPluginResult*)resultWithStatus:(ASTCommandStatus)statusOrdinal messageToErrorObject:(int)errorCode;

+ (void)setVerbose:(BOOL)verbose;
+ (BOOL)isVerbose;

- (void)setKeepCallbackAsBool:(BOOL)bKeepCallback;

- (NSString*)argumentsAsJSON;

@end
