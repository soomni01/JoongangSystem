package com.example.backend.service.customer;

import com.example.backend.dto.commonCode.CommonCode;
import com.example.backend.dto.customer.Customer;
import com.example.backend.mapper.customer.CustomerMapper;
import com.example.backend.mapper.item.ItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerService {
    final CustomerMapper mapper;
    final ItemMapper itemMapper;

    //협력업체 등록
    public void addCustomer(Customer customer) {
//        System.out.println(customer.getItemName());
//        customer.setItemCode(itemMapper.getItemCode(customer.getItemName()));
//        System.out.println(customer);

        mapper.addCustomer(customer);
    }

    public List<Customer> customerList() {
        return mapper.customerList();
    }

    public Customer viewCustomer(String customerKey) {
        return mapper.viewCustomer(customerKey);
    }

    public void deleteCustomer(String customerKey) {
        mapper.deleteCustomer(customerKey);
    }

    public Boolean editCustomer(Customer customer) {
        int cnt = 0;
        cnt = mapper.editCustomer(customer);
        return cnt == 1;
    }

    public List<CommonCode> itemCodeList() {
        return mapper.itemCodeList();
    }
}
