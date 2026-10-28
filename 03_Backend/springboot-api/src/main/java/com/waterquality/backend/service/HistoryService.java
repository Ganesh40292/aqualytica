package com.waterquality.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.waterquality.backend.dto.HistoryResponse;

public interface HistoryService {

    List<HistoryResponse> getAllHistory();

    List<HistoryResponse> getRecentHistory();

    Page<HistoryResponse> getPaginatedHistory(int page, int size);

}