import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Map;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class Fixmd {

	public static void main(String[] args) throws Exception {
		Pattern pattern = Pattern.compile("^\\#+\\s*\\<a\\s+\\w+=\"(.+)\"\s*>\s*</a>\s*(.*)\s*$");
		var replacementMap = Files.lines(Path.of("asyncapi.md"))
			.filter(l -> l.matches("^\\#+.*"))
			.map(l -> patternGroupsToArray(pattern, l))
			.collect(Collectors.groupingBy(x->x.get(0), Collectors.mapping(x->x.get(1), Collectors.toList())));

		System.out.println(replacementMap);


		Files.write(
				Path.of("result.md"),
				Files.lines(Path.of("asyncapi.md"))
					.map(l -> l.matches(".*\\(\\#user-content-[\\w\\-]+\\).*") ? replaceOldAnchor(l, replacementMap) : l)
					.toList(),
				StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE_NEW
		);


	}

	public static String replaceOldAnchor(String line, Map<String, List<String>> replacementMap) {
		Pattern pattern = Pattern.compile(".*\\((\\#user-content-([\\w\\-]+))\\).*");
		Matcher matcher = pattern.matcher(line);
		if(matcher.matches()) {
			String oldAnchorKey = matcher.group(2);
			if(replacementMap.containsKey(oldAnchorKey)) {
				String oldAnchor = matcher.group(1);
				String newAnchor = "#" + replacementMap.get(oldAnchorKey).get(0).trim().toLowerCase().replaceAll("\\s", "-");
				System.out.println("Replacing %s with %s".formatted(oldAnchor, newAnchor));
				return line.replace(oldAnchor, newAnchor);
			} else {
				System.out.println("Key not found:" + oldAnchorKey);
			}
		}

		return line;

	}

	public static List<String> patternGroupsToArray(Pattern pattern, String s) {
		Matcher matcher = pattern.matcher(s);
		if(matcher.matches()) {
			return List.of(matcher.group(1), matcher.group(2));
		} else {
			return List.of("", s);
		}
	}

}
