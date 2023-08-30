package main.wonprice.domain.email.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.wonprice.domain.member.entity.Member;

import javax.persistence.*;

@Entity
@Getter @Setter
@NoArgsConstructor
public class AuthEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long emailId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String authCode;

    public AuthEmail(String email, String authCode) {
        this.email = email;
        this.authCode = authCode;
    }
}
