package com.tuyenshop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tuyenshop.model.PaymentMethod;
import com.tuyenshop.payload.request.CheckoutRequest;
import com.tuyenshop.payload.request.OrderItemRequest;
import com.tuyenshop.payload.response.OrderResponse;
import com.tuyenshop.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void checkout_ReturnsSuccess() throws Exception {
        // Arrange
        CheckoutRequest request = new CheckoutRequest();
        request.setCustomerName("Integration Test");
        request.setCustomerPhone("0987654321");
        request.setCustomerAddress("123 Integration Ave");
        request.setPaymentMethod(PaymentMethod.COD);

        OrderItemRequest item = new OrderItemRequest();
        item.setVariantId(1L);
        item.setQuantity(1);
        request.setItems(Collections.singletonList(item));

        OrderResponse mockResponse = new OrderResponse();
        mockResponse.setOrderCode("ORD-123456");
        mockResponse.setCustomerName("Integration Test");
        mockResponse.setTotalAmount(BigDecimal.valueOf(5000));

        when(orderService.checkout(any(CheckoutRequest.class))).thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/orders/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.result.orderCode").value("ORD-123456"))
                .andExpect(jsonPath("$.result.customerName").value("Integration Test"));
    }
}
