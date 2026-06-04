package com.tuyenshop.service;

import com.tuyenshop.exception.AppException;
import com.tuyenshop.exception.ErrorCode;
import com.tuyenshop.model.Color;
import com.tuyenshop.payload.response.ColorResponse;
import com.tuyenshop.mapper.ColorMapper;
import java.util.stream.Collectors;
import com.tuyenshop.repository.ColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColorService {

    @org.springframework.beans.factory.annotation.Autowired
    private ColorMapper colorMapper;
    @Autowired
    private ColorRepository colorRepository;

    public List<ColorResponse> getAllColors() {
        return colorRepository.findAll().stream().map(colorMapper::toResponse).collect(Collectors.toList());
    }

    public ColorResponse getColorById(Long id) {
        return colorMapper.toResponse(colorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND)));
    }

    public ColorResponse createColor(Color color) {
        return colorMapper.toResponse(colorRepository.save(color));
    }

    public ColorResponse updateColor(Long id, Color colorDetails) {
        Color color = colorRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));
        color.setName(colorDetails.getName());
        color.setHex(colorDetails.getHex());
        return colorMapper.toResponse(colorRepository.save(color));
    }

    public void deleteColor(Long id) {
        Color color = colorRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));
        colorRepository.delete(color);
    }
}
