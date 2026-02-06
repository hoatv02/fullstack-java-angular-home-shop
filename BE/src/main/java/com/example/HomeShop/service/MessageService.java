package com.example.HomeShop.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.Locale;

/**
 * Service để lấy message từ ResourceBundle theo ngôn ngữ hiện tại
 */
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageSource messageSource;

    /**
     * Lấy message theo key với ngôn ngữ hiện tại
     *
     * @param key message key từ file .properties
     * @return message đã được translate
     */
    public String getMessage(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, null, locale);
    }

    /**
     * Lấy message theo key với parameters
     *
     * @param key message key
     * @param params tham số để format message (nếu có {0}, {1}...)
     * @return message đã được translate và format
     */
    public String getMessage(String key, Object... params) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, params, locale);
    }

    /**
     * Lấy message với locale cụ thể
     *
     * @param key message key
     * @param locale ngôn ngữ cụ thể
     * @return message đã được translate
     */
    public String getMessage(String key, Locale locale) {
        return messageSource.getMessage(key, null, locale);
    }
}