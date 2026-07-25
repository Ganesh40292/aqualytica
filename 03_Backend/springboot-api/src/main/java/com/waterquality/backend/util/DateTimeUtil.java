package com.waterquality.backend.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtil {

    private static final DateTimeFormatter formatter =

            DateTimeFormatter.ofPattern(

                    "dd-MM-yyyy HH:mm:ss");

    public static String getCurrentTime() {

        return LocalDateTime.now()

                .format(formatter);

    }

}