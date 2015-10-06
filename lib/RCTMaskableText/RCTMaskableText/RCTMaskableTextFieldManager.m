/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTMaskableTextFieldManager.h"

#import "RCTBridge.h"
#import "RCTShadowView.h"
#import "RCTSparseArray.h"
#import "RCTMaskableTextField.h"

@interface RCTMaskableTextFieldManager() <UITextFieldDelegate>

@end

@implementation RCTMaskableTextFieldManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    RCTMaskableTextField *textField = [[RCTMaskableTextField alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
    textField.delegate = self;
    return textField;
}

- (BOOL)textField:(RCTMaskableTextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    if (textField.maxLength == nil || [string isEqualToString:@"\n"]) {  // Make sure forms can be submitted via return
        return YES;
    }
    NSUInteger allowedLength = textField.maxLength.integerValue - textField.text.length + range.length;
    if (string.length > allowedLength) {
        if (string.length > 1) {
            // Truncate the input string so the result is exactly maxLength
            NSString *limitedString = [string substringToIndex:allowedLength];
            NSMutableString *newString = textField.text.mutableCopy;
            [newString replaceCharactersInRange:range withString:limitedString];
            textField.text = newString;
            // Collapse selection at end of insert to match normal paste behavior
            UITextPosition *insertEnd = [textField positionFromPosition:textField.beginningOfDocument
                                                                 offset:(range.location + allowedLength)];
            textField.selectedTextRange = [textField textRangeFromPosition:insertEnd toPosition:insertEnd];
            [textField textFieldDidChange];
        }
        return NO;
    } else {
        return YES;
    }
}

RCT_EXPORT_VIEW_PROPERTY(caretHidden, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoCorrect, BOOL)
RCT_REMAP_VIEW_PROPERTY(editable, enabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(placeholderTextColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(selectionRange, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(maxLength, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(clearButtonMode, UITextFieldViewMode)
RCT_REMAP_VIEW_PROPERTY(clearTextOnFocus, clearsOnBeginEditing, BOOL)
RCT_EXPORT_VIEW_PROPERTY(selectTextOnFocus, BOOL)
RCT_EXPORT_VIEW_PROPERTY(keyboardType, UIKeyboardType)
RCT_EXPORT_VIEW_PROPERTY(returnKeyType, UIReturnKeyType)
RCT_EXPORT_VIEW_PROPERTY(enablesReturnKeyAutomatically, BOOL)
RCT_EXPORT_VIEW_PROPERTY(secureTextEntry, BOOL)
RCT_REMAP_VIEW_PROPERTY(password, secureTextEntry, BOOL) // backwards compatibility
RCT_REMAP_VIEW_PROPERTY(color, textColor, UIColor)
RCT_REMAP_VIEW_PROPERTY(autoCapitalize, autocapitalizationType, UITextAutocapitalizationType)
RCT_REMAP_VIEW_PROPERTY(textAlign, textAlignment, NSTextAlignment)
RCT_CUSTOM_VIEW_PROPERTY(fontSize, CGFloat, RCTMaskableTextField)
{
    view.font = [RCTConvert UIFont:view.font withSize:json ?: @(defaultView.font.pointSize)];
}
RCT_CUSTOM_VIEW_PROPERTY(fontWeight, NSString, __unused RCTMaskableTextField)
{
    view.font = [RCTConvert UIFont:view.font withWeight:json]; // defaults to normal
}
RCT_CUSTOM_VIEW_PROPERTY(fontStyle, NSString, __unused RCTMaskableTextField)
{
    view.font = [RCTConvert UIFont:view.font withStyle:json]; // defaults to normal
}
RCT_CUSTOM_VIEW_PROPERTY(fontFamily, NSString, RCTMaskableTextField)
{
    view.font = [RCTConvert UIFont:view.font withFamily:json ?: defaultView.font.familyName];
}
RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)

- (RCTViewManagerUIBlock)uiBlockToAmendWithShadowView:(RCTShadowView *)shadowView
{
    NSNumber *reactTag = shadowView.reactTag;
    UIEdgeInsets padding = shadowView.paddingAsInsets;
    return ^(__unused RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
        ((RCTMaskableTextField *)viewRegistry[reactTag]).contentInset = padding;
    };
}

@end