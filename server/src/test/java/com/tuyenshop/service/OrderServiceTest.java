package com.tuyenshop.service;

import com.tuyenshop.exception.AppException;
import com.tuyenshop.exception.ErrorCode;
import com.tuyenshop.mapper.OrderMapper;
import com.tuyenshop.model.*;
import com.tuyenshop.payload.request.CheckoutRequest;
import com.tuyenshop.payload.request.OrderItemRequest;
import com.tuyenshop.payload.response.OrderResponse;
import com.tuyenshop.repository.OrderDetailRepository;
import com.tuyenshop.repository.OrderRepository;
import com.tuyenshop.repository.ProductVariantRepository;
import com.tuyenshop.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderDetailRepository orderDetailRepository;

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderService orderService;

    private CheckoutRequest checkoutRequest;
    private ProductVariant productVariant;

    @BeforeEach
    void setUp() {
        checkoutRequest = new CheckoutRequest();
        checkoutRequest.setCustomerName("Test User");
        checkoutRequest.setCustomerPhone("1234567890");
        checkoutRequest.setCustomerAddress("123 Test St");
        checkoutRequest.setPaymentMethod(PaymentMethod.COD);

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setVariantId(1L);
        itemRequest.setQuantity(2);
        checkoutRequest.setItems(Collections.singletonList(itemRequest));

        productVariant = new ProductVariant();
        productVariant.setId(1L);
        productVariant.setStock(10);
        productVariant.setPrice(BigDecimal.valueOf(100));
    }

    @Test
    void checkout_Success() {
        // Arrange
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("testuser");
        when(authentication.getName()).thenReturn("testuser");

        User user = new User();
        user.setUsername("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        when(productVariantRepository.findById(1L)).thenReturn(Optional.of(productVariant));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse orderResponse = new OrderResponse();
        when(orderMapper.toResponse(any(Order.class))).thenReturn(orderResponse);

        // Act
        OrderResponse result = orderService.checkout(checkoutRequest);

        // Assert
        assertNotNull(result);
        verify(productVariantRepository, times(1)).save(productVariant);
        assertEquals(8, productVariant.getStock()); // Stock should be decremented
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void checkout_InsufficientStock_ThrowsException() {
        // Arrange
        productVariant.setStock(1); // Less than requested 2
        when(productVariantRepository.findById(1L)).thenReturn(Optional.of(productVariant));

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> orderService.checkout(checkoutRequest));
        assertEquals(ErrorCode.INSUFFICIENT_STOCK, exception.getErrorCode());
    }

    @Test
    void checkout_VariantNotFound_ThrowsException() {
        // Arrange
        when(productVariantRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> orderService.checkout(checkoutRequest));
        assertEquals(ErrorCode.VARIANT_NOT_FOUND, exception.getErrorCode());
    }
}
