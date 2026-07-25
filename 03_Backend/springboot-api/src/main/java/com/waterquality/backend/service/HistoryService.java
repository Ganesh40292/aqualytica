package com.waterquality.backend.service;

import java.util.List;

import com.waterquality.backend.dto.HistoryResponse;

public interface HistoryService {

    List<HistoryResponse> getAllHistory();

    List<HistoryResponse> getRecentHistory();

}