package com.tuyenshop.repository;

import com.tuyenshop.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrderId(Long orderId);

    @org.springframework.data.jpa.repository.Query("SELECT CASE WHEN COUNT(od) > 0 THEN true ELSE false END FROM OrderDetail od WHERE od.order.user.id = :userId AND od.productVariant.product.id = :productId AND od.order.orderStatus = 'DELIVERED'")
    boolean existsByUserIdAndProductIdAndDelivered(@org.springframework.data.repository.query.Param("userId") Long userId, @org.springframework.data.repository.query.Param("productId") Long productId);
}
