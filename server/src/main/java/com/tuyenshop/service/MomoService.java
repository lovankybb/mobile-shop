package com.tuyenshop.service;

import com.tuyenshop.config.MomoConfig;
import com.tuyenshop.model.PaymentStatus;
import com.tuyenshop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MomoService {

    @Autowired
    private MomoConfig momoConfig;

    @Autowired
    private OrderRepository orderRepository;

    public String createPaymentUrl(long amount, String orderCode) throws Exception {
        String requestId = String.valueOf(System.currentTimeMillis());
        String orderId = orderCode;
        String amountStr = String.valueOf(amount);
        String orderInfo = "Thanh toan don hang: " + orderId;
        String returnUrl = momoConfig.getReturnUrl();
        String notifyUrl = momoConfig.getNotifyUrl();
        String requestType = "payWithMethod";
        String extraData = "";
        String partnerCode = momoConfig.getPartnerCode();
        String accessKey = momoConfig.getAccessKey();
        String secretKey = momoConfig.getSecretKey();

        String rawHash = "accessKey=" + accessKey +
                "&amount=" + amountStr +
                "&extraData=" + extraData +
                "&ipnUrl=" + notifyUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + returnUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = MomoConfig.signHmacSHA256(rawHash, secretKey);

        Map<String, Object> body = new HashMap<>();
        body.put("partnerCode", partnerCode);
        body.put("partnerName", "Test");
        body.put("storeId", "MomoTestStore");
        body.put("requestId", requestId);
        body.put("amount", amountStr);
        body.put("orderId", orderId);
        body.put("orderInfo", orderInfo);
        body.put("redirectUrl", returnUrl);
        body.put("ipnUrl", notifyUrl);
        body.put("lang", "vi");
        body.put("extraData", extraData);
        body.put("requestType", requestType);
        body.put("signature", signature);

        RestTemplate restTemplate = new RestTemplate();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(body, headers);

        ResponseEntity<Map> responseEntity = restTemplate.postForEntity(momoConfig.getEndpoint(), entity, Map.class);
        Map<String, Object> responseBody = responseEntity.getBody();

        if (responseBody != null && responseBody.containsKey("payUrl")) {
            return (String) responseBody.get("payUrl");
        }
        throw new RuntimeException("Failed to create Momo payment");
    }

    public boolean processPaymentReturn(Map<String, String> params) {
        String orderCode = params.get("orderId");
        String resultCode = params.get("resultCode");
        String errorCode = params.get("errorCode");
        boolean isSuccess = "0".equals(resultCode) || "0".equals(errorCode);

        if (isSuccess) {
            orderRepository.findByOrderCode(orderCode).ifPresent(order -> {
                order.setPaymentStatus(PaymentStatus.SUCCESS);
                orderRepository.save(order);
            });
        } else {
            orderRepository.findByOrderCode(orderCode).ifPresent(order -> {
                order.setPaymentStatus(PaymentStatus.FAILED);
                orderRepository.save(order);
            });
        }
        return isSuccess;
    }
}
