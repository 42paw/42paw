package proj.pet.member.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import proj.pet.utils.domain.RuntimeExceptionThrower;
import proj.pet.utils.domain.Validatable;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Embeddable
public class OauthProfile implements Validatable {

	@Column(name = "oauth_type", nullable = false)
	@Enumerated(EnumType.STRING)
	private OauthType type;

	@Column(name = "oauth_id", nullable = false)
	private String id;

	@Column(name = "oauth_name")
	private String name;

	private OauthProfile(OauthType type, String id, String name) {
		this.type = type;
		this.id = id;
		this.name = name;
		RuntimeExceptionThrower.checkValidity(this);
	}

	public static OauthProfile of(OauthType type, String id, String oauthName) {
		return new OauthProfile(type, id, oauthName);
	}

	@Override public boolean isValid() {
		return type != null
				&& id != null;
	}
}