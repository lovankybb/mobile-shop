package com.tuyenshop.controller;

import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.service.MomoService;
import com.tuyenshop.service.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private MomoService momoService;

    @GetMapping("/create_payment")
    public ResponseEntity<?> createPayment(HttpServletRequest request, 
                                           @RequestParam("amount") long amount,
                                           @RequestParam("orderCode") String orderCode) {
        String paymentUrl = vnPayService.createPaymentUrl(request, amount, orderCode);
        return ResponseEntity.ok(ApiResponse.success("Successfully generated payment url", paymentUrl));
    }

    @GetMapping("/vnpay_return")
    public void paymentReturn(
            @RequestParam Map<String, String> params,
            HttpServletResponse response
    ) throws Exception {
        String orderCode = params.get("vnp_TxnRef");
        boolean isSuccess = vnPayService.processPaymentReturn(params);

        // Redirect to frontend
        String redirectUrl = "http://localhost:5173/payment-result?orderCode=" + orderCode + "&success=" + isSuccess;
        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/create_momo_payment")
    public ResponseEntity<?> createMomoPayment(@RequestParam("amount") long amount,
                                               @RequestParam("orderCode") String orderCode) {
        try {
            String paymentUrl = momoService.createPaymentUrl(amount, orderCode);
            return ResponseEntity.ok(ApiResponse.success("Successfully generated payment url", paymentUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(ApiResponse.error(500, e.getMessage()));
        }
    }

    @GetMapping("/momo_return")
    public void momoReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws Exception {
        String orderCode = params.get("orderId");
        boolean isSuccess = momoService.processPaymentReturn(params);

        String redirectUrl = "http://localhost:5173/payment-result?orderCode=" + orderCode + "&success=" + isSuccess;
        response.sendRedirect(redirectUrl);
    }
}
